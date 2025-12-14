import React, { useEffect, useState, useMemo } from "react";
import { Card, Badge, Spin, Avatar, Button, Checkbox } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useWebSocket } from "../../hooks/useWebSocket";
import { fetchConsultList, type ChatMessage, type ConsultItem } from "../../services/consultService.ts";
import useUserInfoStore from "../../store/userInfostore";
import globalErrorHandler from "../../utils/globalAxiosErrorHandler";
import toast from "react-hot-toast";
import { MessageFilled } from "@ant-design/icons";
import type { WSMessage } from "../../services/ws/types.ts";

dayjs.extend(relativeTime);

const ConsultList = () => {
    const [consults, setConsults] = useState<ConsultItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const updateNotificationCount = useUserInfoStore((s) => s.updateNotificationCount);

    const { on } = useWebSocket();

    // 监听实时消息
   useEffect(() => {
  const unsubscribe = on("private_chat", (msg: WSMessage<ChatMessage>) => {
    const data = msg.data!;
    setConsults(prev => {
      const exist = prev.find(c => c.customerId === data.from);
      if (exist) {
        return prev.map(c =>
          c.customerId === data.from
            ? { ...c, latestMessage: data.content, latestTime: new Date().toISOString(), unread: c.unread + 1 }
            : c
        );
      } else {
        return [{ customerId: data.from, name: data.from, avatar: "", latestMessage: data.content, latestTime: new Date().toISOString(), unread: 1 }, ...prev];
      }
    });
    updateNotificationCount(count => count + 1);
  });
  return () => unsubscribe();
}, [on, updateNotificationCount]);
    // 初始化加载咨询列表
    useEffect(() => {
        const fetchData = async () => {
            try {
                const list = await fetchConsultList();
                setConsults(list);
            } catch (e) {
                globalErrorHandler.handle(e, toast.error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 按时间排序
    const sortedConsults = useMemo(() => {
        return [...consults].sort((a, b) => dayjs(b.latestTime).valueOf() - dayjs(a.latestTime).valueOf());
    }, [consults]);

    // 切换选择
    const toggleSelect = (customerId: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(customerId)) newSet.delete(customerId);
            else newSet.add(customerId);
            return newSet;
        });
    };

    // 全选 / 取消全选
    const toggleSelectAll = (checked: boolean) => {
        if (checked) setSelectedIds(new Set(consults.map(c => c.customerId)));
        else setSelectedIds(new Set());
    };

    // 删除选中
    const deleteSelected = () => {
        if (selectedIds.size === 0) return toast.error("请选择要删除的咨询");
        setConsults(prev => prev.filter(c => !selectedIds.has(c.customerId)));
        // 更新通知数量
        let unreadCountToRemove = 0;
        consults.forEach(c => { if (selectedIds.has(c.customerId)) unreadCountToRemove += c.unread; });
        updateNotificationCount(count => Math.max(0, count - unreadCountToRemove));
        setSelectedIds(new Set());
        toast.success("已删除选中咨询");
    };

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
            <div className="mb-4 py-4 pl-4 bg-white rounded-sm border-b-2 border-gray-100 flex justify-between items-center">
                <h1 className="text-[22px] font-semibold text-gray-800">我的咨询</h1>

                {/* 操作栏：全选 + 删除按钮 */}
                <div className="flex items-center gap-3">
                    <Checkbox
                        checked={selectedIds.size === consults.length && consults.length > 0}
                        indeterminate={selectedIds.size > 0 && selectedIds.size < consults.length}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                    >
                        全选
                    </Checkbox>

                    <Button type="primary" className=" rounded-sm bg-red-300 hover:bg-red-600" danger onClick={deleteSelected}>
                        删除选中
                    </Button>
                </div>
            </div>

            {/* 咨询列表 */}
            <div className="space-y-2">
                <div className="h-[450px] overflow-y-auto pb-2 pr-[6px] 
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:rounded-xl
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:rounded-xl
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
          [&::-webkit-scrollbar-button]:hidden
        ">
                    {sortedConsults.length === 0 && (

                        <div className="flex flex-col items-center justify-center h-full  text-gray-400">
                            <MessageFilled className="text-4xl mb-2" />
                            <div className="text-lg">暂无对话</div>
                        </div>
                    )}
                    {sortedConsults.map(c => (
                        <Card
                            key={c.customerId}
                            hoverable
                            className="flex items-center mb-1 justify-between px-2 py-1 cursor-pointer rounded-sm shadow-sm bg-white relative"
                            onClick={() => window.open(`/my-consult/${c.customerId}`, "_myCustomer-page")}
                            bodyStyle={{ padding: "10px" }}
                        >
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={selectedIds.has(c.customerId)}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => toggleSelect(c.customerId)}
                                />
                                <Avatar src={c.avatar} size={36}>{!c.avatar && c.name[0]}</Avatar>
                                <div className="flex flex-col">
                                    <div className="font-semibold text-gray-800">{c.name}</div>
                                    <div className="text-gray-500 text-[13px] truncate w-[200px]">{c.latestMessage}</div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                                {c.unread > 0 && (
                                    <Badge
                                        count={c.unread}
                                        overflowCount={99}
                                        className="absolute right-2 top-9 -translate-y-1/2"
                                    />
                                )}
                            </div>
                            <div className="text-gray-400 absolute right-2 bottom-2 text-[12px]">{dayjs(c.latestTime).format("MM-DD HH:mm")}</div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ConsultList;
