import { use } from "react";
import { WSContext } from "../services/ws/webSocketContext";

/**
 * 自定义Hook，用于获取WebSocket相关功能和方法
 * @returns {Object} 返回包含WebSocket相关操作方法的对象
 *   - send: 发送消息的方法
 *   - on: 绑定特定事件监听器的方法
 *   - off: 移除特定事件监听器的方法
 *   - onAny: 绑定任意事件监听器的方法
 *   - offAny: 移除任意事件监听器的方法
 *   - readyState: WebSocket连接状态
 *   - isLeader: 是否为主节点
 *   - disconnect: 断开连接的方法
 * @throws {Error} 如果在WebSocketProvider外部使用，将抛出错误
 */
export function useWebSocket() {
  const ctx = use(WSContext);  // 获取WebSocketProvider的上下文
  if (!ctx) throw new Error("必须在WebSocketProvider内部使用useWebSocket");

  return {
    send: ctx.send,
    on: ctx.router.on.bind(ctx.router),
    off: ctx.router.off.bind(ctx.router),
    onAny: ctx.router.onAny.bind(ctx.router),
    offAny: ctx.router.offAny.bind(ctx.router),
    readyState: ctx.readyState,
    isLeader: ctx.isLeader,
    disconnect: ctx.disconnect,
  };
}
