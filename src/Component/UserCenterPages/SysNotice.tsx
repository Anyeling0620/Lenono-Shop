import { useState, useEffect, useMemo } from "react";
import { Tabs, Card, Tag, Divider, Spin } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MailOutlined } from "@ant-design/icons";

import useUserInfoStore from "../../store/userInfostore";
import {
  fetchNotices,
  fetchUnreadCount,
  markNoticeRead,
  markAllReadRequest,
  deleteReadRequest,
  clearAllRequest,
  type Notice
} from "../../services/noticeService";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
import { useWebSocket } from "../../hooks/useWebSocket";
import type { WSMessage } from "../../services/ws/types";

dayjs.extend(relativeTime);

const TAG_COLOR = {
  info: "blue",
  warning: "orange",
  system: "geekblue",
  event: "purple",
};

const TAG_TEXT = {
  info: "通知",
  warning: "提醒",
  system: "系统",
  event: "活动",
};

const SysNotice = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("unread");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const notificationCount = useUserInfoStore((s) => s.notificationCount);
  const setNotificationCount = useUserInfoStore((s) => s.setNotificationCount);
  const updateNotificationCount = useUserInfoStore((s) => s.updateNotificationCount);

  const { on } = useWebSocket();

  // WebSocket通知处理
  useEffect(() => {
    const unsubscribe = on("notification", (msg:WSMessage<Notice>) => {
      const data = msg.data! ;
      setNotices(prev => [data, ...prev]); // 新通知在顶部
      updateNotificationCount((count) => count + 1);
    });
    return () => unsubscribe();
  }, [on, updateNotificationCount]);

  // 初始化加载通知 + 未读数
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [list, unread] = await Promise.all([fetchNotices(), fetchUnreadCount()]);
        setNotices(list);
        setNotificationCount(unread);
      } catch (e) {
        globalErrorHandler.handle(e, toast.error);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(fetchData, 600);
  }, [setNotificationCount]);

  
  // 过滤通知
  const filteredNotices = useMemo(() => {
    if (activeTab === "unread") return notices.filter(n => !n.read);
    if (activeTab === "read") return notices.filter(n => n.read);
    return notices;
  }, [activeTab, notices]);

  // 展开 + 延迟标记已读
  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const newVal = !prev[id];

      if (newVal) {
        setTimeout(async () => {
          setNotices(prevNotices => {
            const target = prevNotices.find(n => n.id === id);
            if (target && !target.read) {
              markNoticeRead(id);
              updateNotificationCount((count) => Math.max(0, count - 1));
              return prevNotices.map(n => (n.id === id ? { ...n, read: true } : n));
            }
            return prevNotices;
          });
        }, 1200);
      }

      return { ...prev, [id]: newVal };
    });
  };

  // 一键已读
  const markAllRead = async () => {
    await markAllReadRequest();
    setNotices(prev => prev.map(n => ({ ...n, read: true })));
    updateNotificationCount(0);
  };

  // 删除已读
  const deleteRead = async () => {
    await deleteReadRequest();
    setNotices(prev => {
      const newList = prev.filter(n => !n.read);
      updateNotificationCount(newList.filter(n => !n.read).length);
      return newList;
    });
  };

  // 清空全部
  const clearAll = async () => {
    await clearAllRequest();
    setNotices([]);
    updateNotificationCount(0);
  };

  const tabs = [
    { key: "unread", label: `未读 (${notificationCount})` },
    { key: "read", label: `已读 (${notices.length - notificationCount})` },
    { key: "all", label: `全部 (${notices.length})` },
  ];

  if (loading) {
    return (
      <div className="py-40 w-full flex items-center justify-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="p-6 w-full mx-auto">
      {/* Header */}
      <div className="mb-6 py-4 pl-4 bg-white rounded-sm border-b-2 border-gray-100">
        <h1 className="text-[22px] font-semibold text-gray-800 pb-2">系统通知</h1>
      </div>

      {/* Tabs + Action Buttons */}
      <div className="flex flex-wrap items-center mb-3 gap-3">
        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ flex: 1 }} items={tabs} />
        <div className="flex space-x-2 text-[13px] border-b-[1px] -mb-[1px]">
          <button onClick={markAllRead} className="px-4 py-1 bg-gray-100 hover:bg-gray-200">
            一键已读
          </button>
          <button onClick={deleteRead} className="px-4 py-1 bg-gray-100 hover:bg-gray-200">
            删除已读
          </button>
          <button onClick={clearAll} className="px-4 py-1 bg-red-400 text-white hover:bg-red-500">
            清空全部
          </button>
        </div>
      </div>

      {/* List */}
      <div className={`h-[470px] overflow-y-auto pr-[6px] pb-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-thumb]:bg-gray-300`}>
        {filteredNotices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MailOutlined className="text-4xl mb-2" />
            <div className="text-lg">暂无通知</div>
          </div>
        ) : (
          filteredNotices.map((n) => {
            const isExpand = expanded[n.id];
            return (
              <Card
                key={n.id}
                hoverable
                className={`relative rounded-sm bg-white mb-3 shadow transition-all duration-200 ${n.read ? "opacity-75" : ""}`}
                bodyStyle={{ padding: "10px" }}
                onClick={() => toggleExpand(n.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[15px] font-semibold">{n.title}</div>
                    <div className="text-[11px] text-gray-500">
                      {dayjs(n.time).format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag color={TAG_COLOR[n.type]} style={{ fontSize: 11 }}>
                      {TAG_TEXT[n.type]}
                    </Tag>
                    {!n.read && <Tag color="red" style={{ fontSize: 11 }}>未读</Tag>}
                    <div className={`transition-transform duration-300 text-gray-500 text-sm ${isExpand ? "rotate-180" : ""}`}>▼</div>
                  </div>
                </div>

                <Divider className="mt-0 mb-0" />

                <div
                  className="transition-all duration-300 overflow-hidden"
                  style={{ maxHeight: isExpand ? "200px" : "0px", opacity: isExpand ? 1 : 0 }}
                >
                  <div className="text-[13px] mt-2 text-gray-700 whitespace-pre-line pb-1">
                    {n.content}
                  </div>
                </div>

                {!isExpand && <div className="h-0.5"></div>}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SysNotice;
