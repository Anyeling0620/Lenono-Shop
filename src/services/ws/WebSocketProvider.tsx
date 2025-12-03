
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useWebSocket from "react-use-websocket";
import { MessageRouter } from "./messageRouter";
import type { WSMessage, ForceLogoutPayload } from "./types";
import { axiosService } from "../AxiosService";
import { WSContext } from "./webSocketContext";


const CHANNEL = "ws-coordinator-v1";  //  WebSocket频道的常量名称，用于标识连接的频道
const LEADER_TIMEOUT = 4000;   //  领导者超时时间，单位为毫秒，用于WebSocket连接的超时控制

/**
 * WebSocketProvider组件 - 提供WebSocket连接和广播频道功能
 * @param children - React子组件
 */
/**
 * WebSocketProvider组件，用于提供WebSocket连接和消息管理功能
 * @param children - 子组件，将接收WebSocket上下文
 */
export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // 使用useMemo创建消息路由器实例，避免不必要的重新创建
  const router = useMemo(() => new MessageRouter(), []);

  // 从环境变量获取WebSocket基础URL，确保连接地址的正确配置
  const WS_BASE_URL = import.meta.env.VITE_WS_URL; // from .env

  // 获取访问令牌，用于WebSocket认证
  const token = axiosService.getAccessToken() ?? "";  

  // 构建WebSocket URL，包含token参数，确保安全连接
  const wsUrl = useMemo(() => {
    if (!token) return null;
    const params = new URLSearchParams({ token });
    return `${WS_BASE_URL}?${params.toString()}`;
  }, [WS_BASE_URL, token]);

  // 创建广播频道引用，用于多标签页通信
  const bcRef = useRef<BroadcastChannel | null>(null);
  // 是否为领导者的状态，用于控制WebSocket消息的发送
  const [isLeader, setIsLeader] = useState(false);
  // 记录最后一次心跳的时间，用于判断领导者是否存活
  const lastLeaderHeartbeat = useRef(0);

  // 使用WebSocket钩子，配置连接参数和重连策略
  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } =
    useWebSocket(
      wsUrl,
      {
        shouldReconnect: () => true, // 始终尝试重连，确保连接可靠性 //  配置重连策略
        reconnectAttempts: Infinity, //  无限次重连尝试
        reconnectInterval: (attempt) =>
          Math.min(1000 * Math.pow(1.5, attempt), 20000), // 指数退避重连 ，最大间隔20秒
        heartbeat: { //  配置心跳机制
          interval: 30000, //  每30秒发送一次心跳
          message: JSON.stringify({ type: "ping" }), // 发送ping消息
          returnMessage: "pong", //  期望的响应消息
        },
      },
      true
    );
  // 处理强制登出
  const handleForceLogout = (payload?: ForceLogoutPayload) => {
    console.warn("[WS] forced logout", payload);
    axiosService.forceLogout();
  };

  // 设置广播频道监听器和领导者选举逻辑
  useEffect(() => {
    const bc = new BroadcastChannel(CHANNEL); //  创建一个新的广播通道
    bcRef.current = bc; //  将广播通道实例保存到ref中，以便在其他地方访问

    bc.postMessage({ t: "hello" }); //  发送初始消息，通知其他标签页有新连接

    const listener = (e: MessageEvent) => { //  定义消息监听器函数
      const msg = e.data; //  从消息事件中获取消息数据

      if (msg.t === "hello") { //  处理"hello"类型消息：如果自己是leader，则回复leader-alive
        if (isLeader) bc.postMessage({ t: "leader-alive" });
      }

      if (msg.t === "leader-alive") { //  处理"leader-alive"类型消息：更新最后收到leader心跳的时间
        lastLeaderHeartbeat.current = Date.now();
      }

      if (msg.t === "become-leader") setIsLeader(false); //  处理"become-leader"类型消息：取消当前leader身份

      if (msg.t === "ws-msg") router.dispatch(msg.payload); //  处理"ws-msg"类型消息：将消息内容派发给路由器

      if (msg.t === "force-logout") handleForceLogout(msg.payload); //  处理"force-logout"类型消息：执行强制登出操作

      if (msg.t === "send-request" && isLeader) //  处理"send-request"类型消息：如果是leader则发送JSON消息
        sendJsonMessage(msg.payload);
    };

    bc.addEventListener("message", listener); //  为BroadcastChannel添加消息事件监听器

    const timer = setInterval(() => { //  设置一个定时器，每2秒执行一次
      const diff = Date.now() - lastLeaderHeartbeat.current; //  计算自上次领导者心跳以来的时间差

      if (diff > LEADER_TIMEOUT) { //  如果时间差超过领导者超时阈值
        setIsLeader(true); //  设置当前节点为领导者并发送成为领导者的消息
        bc.postMessage({ t: "become-leader" });
      } else {
        if (isLeader) bc.postMessage({ t: "leader-alive" }); //  如果当前是领导者，则发送存活消息
      }
    }, 2000);

    return () => { //  清理函数，在组件卸载时执行
      clearInterval(timer); //  清除定时器
      bc.removeEventListener("message", listener); //  移除消息事件监听器
      bc.close(); //  关闭BroadcastChannel
    };
  }, [isLeader, router, sendJsonMessage]); //  依赖项数组

  /** Dispatch incoming messages */
  useEffect(() => {
    if (!lastJsonMessage) return;

    const msg = lastJsonMessage as WSMessage; //  处理WebSocket消息的回调函数  const handleWebSocketMessage = useCallback(() => {     将lastJsonMessage断言为WSMessage类型

    if (isLeader && bcRef.current) //  如果是领导者并且存在广播引用，则广播消息
      bcRef.current.postMessage({ t: "ws-msg", payload: msg });

    router.dispatch(msg); //  路由分发消息

    if (msg.type === "force_logout") { //  如果消息类型为强制登出
      if (bcRef.current) //  如果存在广播引用，则广播强制登出消息
        bcRef.current.postMessage({ t: "force-logout", payload: msg.data });

      handleForceLogout(msg.data as ForceLogoutPayload); //  处理强制登出逻辑
    }
  }, [lastJsonMessage, isLeader, router]);

  /** Token refresh → force reconnect */
  useEffect(() => { //  使用 useEffect 钩子来处理组件的生命周期事件
    const handler = () => { //  定义一个事件处理函数 handler，用于处理 token 刷新事件
      try {
        getWebSocket()?.close(); //  尝试获取 WebSocket 实例并关闭连接
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) { /* empty */ }
    }; 
    window.addEventListener("token-refreshed", handler); //  为window对象添加token-refreshed事件监听器，当token刷新时触发handler函数
    return () => window.removeEventListener("token-refreshed", handler); //  返回一个清理函数，用于移除事件监听器   当组件卸载或依赖项改变时，会执行这个函数来清理事件监听
  }, [getWebSocket]); //  依赖项数组，包含getWebSocket函数


  /** Send message */
  const send = (msg: WSMessage) => { /**   * 发送消息的函数   * @param msg - 要发送的消息内容，类型为any   */
    if (isLeader) sendJsonMessage(msg); //  如果是领导者角色，直接发送JSON消息
    else //  否则，通过广播通道发送请求
      bcRef.current?.postMessage({
        t: "send-request", //  消息类型标识为发送请求
        payload: msg, //  实际要发送的消息内容
      });
  };

  const value  = { /**   * 提供给子组件使用的上下文值对象   * 包含发送消息、路由、连接状态、领导者标识和断开连接等功能   */
    send, //  发送消息的方法
    router, //  路由相关功能
    readyState, //  WebSocket连接状态
    isLeader, //  是否为领导者的标识
    disconnect: () => getWebSocket()?.close(), //  断开WebSocket连接的方法
  };

  return <WSContext.Provider value={value}>{children}</WSContext.Provider>; //  使用WSContext.Provider将value传递给子组件
};

