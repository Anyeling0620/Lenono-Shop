import { useEffect, useState, useRef, useCallback } from "react";
import { Avatar, Input, Button, Spin } from "antd";
import { SmileOutlined, SendOutlined } from "@ant-design/icons";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import { useWebSocket } from "../../hooks/useWebSocket";
import {
  fetchConsultList,
  fetchChatHistory,
  sendMessageRequest,
  type ConsultItem,
  type ChatMessage,
  markMessageRead,
} from "../../services/consultService";
import useUserInfoStore from "../../store/userInfostore";
import toast from "react-hot-toast";
import type { WSMessage } from "../../services/ws/types";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import { useParams } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

const MyConsult = () => {
  const userId = useUserInfoStore((s) => s.userId);
  const { customerId } = useParams<{ customerId: string }>();
  const { send, on } = useWebSocket();

  const [consults, setConsults] = useState<ConsultItem[]>([]);
  const [selectedConsult, setSelectedConsult] = useState<ConsultItem | null>(null);
  const [messages, setMessages] = useState<WSMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 滚动聊天区到底部
  const scrollChatToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };



  // 获取咨询列表
  useEffect(() => {
    const fetchList = async () => {
      try {
        const list = await fetchConsultList();
        setConsults(list);
      } catch (err) {
        globalErrorHandler.handle(err, toast.error);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);


  // 切换聊天对象
 const selectConsult = useCallback(async (c: ConsultItem) => {
  setSelectedConsult(c);
  setInputValue("");
  setShowEmoji(false);

   // 清除未读消息
  if (c.unread > 0) {
    setConsults((prev) =>
      prev.map((item) =>
        item.customerId === c.customerId ? { ...item, unread: 0 } : item
      )
    );
    try {
      await markMessageRead(c.customerId); // 调用接口标记已读
    } catch {
      toast.error("标记已读失败");
    }
  }

  try {
    const history = await fetchChatHistory(c.customerId);
    setMessages(history);
    setTimeout(scrollChatToBottom, 100);
  } catch {
    toast.error("获取聊天历史失败");
  }
}, []);



  // 监听实时消息
  useEffect(() => {
    const unsubscribe = on("private_chat", (msg:WSMessage<ChatMessage>) => {
      const data = msg.data!;
      if (selectedConsult && data.from === selectedConsult.customerId) {
        setMessages((prev) => [...prev, msg]);
        scrollChatToBottom();
      } else {
        setConsults((prev) =>
          prev.map((c) =>
            c.customerId === data.from
              ? {
                ...c,
                unread: c.unread + 1,
                latestMessage: data.content,
                latestTime: new Date().toISOString(),
              }
              : c
          )
        );
      }
    });
    return () => unsubscribe();
  }, [on, selectedConsult]);

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || !selectedConsult) return;
    const msg: WSMessage<ChatMessage> = {
      type: "private_chat",
      data: {
        from: userId,
        to: selectedConsult.customerId,
        content: inputValue,
        time: new Date().toISOString(),
      },
    };
    send(msg);
    setMessages((prev) => [...prev, msg]);
    setInputValue("");
    scrollChatToBottom();
    await sendMessageRequest(msg);
  };

  // emoji 点击
  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setInputValue((prev) => prev + emojiObject.emoji);
  };

  // 消息或聊天对象变化时滚动到底部
  useEffect(() => {
    scrollChatToBottom();
  }, [messages, selectedConsult]);

  // 获取咨询列表后自动选择
  useEffect(() => {
    if (customerId) {
      const c = consults.find(c => c.customerId === customerId);
      if (c) selectConsult(c);
    }
  }, [customerId, consults, selectConsult]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[1200px] mt-4 mx-auto h-[80vh] border rounded-md shadow-md overflow-hidden">
      {/* 左侧会话列表 */}
      <div className="overflow-y-auto border-r w-[300px] [&::-webkit-scrollbar]:w-0
                ">
        {consults.map((c) => (
          <div
            key={c.customerId}
            className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 ${selectedConsult?.customerId === c.customerId ? "bg-gray-100" : ""
              }`}
            onClick={() => selectConsult(c)}
          >
            <Avatar src={c.avatar}>{!c.avatar && c.name[0]}</Avatar>
            <div className="flex-1 flex flex-col truncate">
              <span className="font-medium truncate">{c.name}</span>
              <span className="text-gray-500 text-sm truncate">{c.latestMessage}</span>
            </div>
            <div className="flex flex-col items-end text-right">
              {c.unread > 0 && (
                <span className="bg-red-500 text-white px-2 rounded-full text-xs">{c.unread}</span>
              )}
              <span className="text-gray-400 text-xs">{dayjs(c.latestTime).format("MM-DD HH:mm")}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 右侧聊天区 */}
      <div className="flex-1 flex flex-col relative bg-white">
        <div className="bg-[#eeeeee] h-14 px-4 py-2 border-b flex flex-col justify-center">
          <div className="font-semibold text-gray-800">{selectedConsult?.name}</div>
          <div className={`text-xs ${selectedConsult
            ? dayjs().diff(dayjs(selectedConsult.latestTime), "minute") <= 5
              ? "text-green-600"
              : "text-gray-400"
            : "text-gray-400"
            }`}>
            {selectedConsult
              ? dayjs().diff(dayjs(selectedConsult.latestTime), "minute") <= 5
                ? "在线"
                : `${dayjs(selectedConsult.latestTime).fromNow()}在线`
              : ""}
          </div>
        </div>

        <div
          className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:rounded-xl
                [&::-webkit-scrollbar-track]:bg-gray-50
                [&::-webkit-scrollbar-thumb]:rounded-xl
                [&::-webkit-scrollbar-thumb]:bg-gray-100
                [&::-webkit-scrollbar-thumb:hover]:bg-gray-200
                [&::-webkit-scrollbar-button]:hidden"
          ref={chatContainerRef}
          style={{ minHeight: 0 }}
        >
          {selectedConsult ? (
            messages.map((m, idx) => {
              const isMe = m.data.from === userId;
              return (
                <div key={idx} className={`flex mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-2 rounded-sm max-w-[60%] ${isMe ? "bg-[#83b3dd] text-white" : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {m.data.content}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400">请选择聊天对象</div>
          )}
        </div>

        {/* 输入框 */}
        {selectedConsult && (
          <div className="p-2 border-t flex items-center gap-2 relative">
            <Button icon={<SmileOutlined />} onClick={() => setShowEmoji((prev) => !prev)} />
            {showEmoji && (
              <div className="absolute bottom-[50px] left-4 z-10">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSend}
              placeholder="输入消息"
            />
            <Button type="primary" className="bg-blue-400" icon={<SendOutlined />} onClick={handleSend}>
              发送
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyConsult;
