// import { axiosInstance, type ApiResponse } from "./axiosService";

import type { WSMessage } from "./ws/types";


// export interface ConsultItem {
//   customerId: string;
//   name: string;
//   avatar?: string;
//   latestMessage: string;
//   latestTime: string;
//   unread: number;
// }

// /**
//  * 获取当前用户的所有咨询列表
//  */
// export async function fetchConsultList(): Promise<ConsultItem[]> {
//   try {
//     const res = await axiosInstance.get<ApiResponse<{ consultList: ConsultItem[] }>>("/consult/list");
//     return res.data.data.consultList;
//   } catch (error) {
//     console.error("[fetchConsultList] 获取咨询列表失败", error);
//     throw error;
//   }
// }

// /**
//  * 获取单条聊天历史
//  */
// export interface ChatMessage {
//   from: string;
//   to: string;
//   content: string;
//   time: string;
// }
// export async function fetchChatHistory(customerId: string): Promise<ChatMessage[]> {
//   try {
//     const res = await axiosInstance.get<ApiResponse<{ chatMessages: ChatMessage[] }>>(`/consult/history/${customerId}`);
//     return res.data.data.chatMessages;
//   } catch (error) {
//     console.error("[fetchChatHistory] 获取聊天历史失败", error);
//     throw error;
//   }
// }

// /**
//  * 发送聊天消息保存到后端
//  */
// export async function sendMessageRequest(msg: ChatMessage) {
//   try {
//     await axiosInstance.post<ApiResponse<null>>("/consult/send", msg);
//     return true
//   } catch (error) {
//     console.error("[sendMessageRequest] 发送消息失败", error);
//     throw error;
//   }
// }


// services/consultService.ts

export interface ConsultItem {
  customerId: string;
  name: string;
  avatar?: string;
  latestMessage: string;
  latestTime: string;
  unread: number;
}

export interface ChatMessage {
  from: string;
  to: string;
  content: string;
  time: string;
}

// 模拟客服列表
export const mockConsultList: ConsultItem[] = [
  {
    customerId: "c001",
    name: "客服小张",
    avatar: "https://i.pravatar.cc/40?img=1",
    latestMessage: "您好，请问有什么可以帮您？",
    latestTime: "2025-12-08T10:12:00Z",
    unread: 2,
  },
  {
    customerId: "c002",
    name: "客服小李",
    avatar: "https://i.pravatar.cc/40?img=2",
    latestMessage: "您的订单已经发货啦~",
    latestTime: "2025-12-07T16:45:00Z",
    unread: 0,
  },
  {
    customerId: "c003",
    name: "客服小王",
    avatar: "https://i.pravatar.cc/40?img=3",
    latestMessage: "请问您的问题解决了吗？",
    latestTime: "2025-12-06T12:20:00Z",
    unread: 1,
  },
];

// 模拟聊天历史
export const mockChatHistory: Record<string, WSMessage<ChatMessage>[]> = {
  c001: [
    { type: "private_chat", data: { from: "user", to: "c001", content: "你好，我想咨询产品问题", time: "2025-12-08T10:10:00Z" } },
    { type: "private_chat", data: { from: "c001", to: "user", content: "您好，请问有什么可以帮您？"  , time: "2025-12-08T10:11:00Z" } },
  ],
  c002: [
    { type: "private_chat", data: { from: "c002", to: "user", content: "您的订单已经发货啦~" , time: "2025-12-07T16:45:00Z" } },
  ],
  c003: [
    { type: "private_chat", data: { from: "user", to: "c003", content: "上次问题没解决" , time: "2025-12-06T12:20:00Z"} },
    { type: "private_chat", data: { from: "c003", to: "user", content: "请问您的问题解决了吗？" , time: "2025-12-06T12:21:00Z"} },
  ],
};

// mock 获取咨询列表
export async function fetchConsultList(): Promise<ConsultItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockConsultList), 400);
  });
}

// mock 获取聊天历史
export async function fetchChatHistory(customerId: string): Promise<WSMessage<ChatMessage>[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockChatHistory[customerId] || []), 300);
  });
}

// mock 发送消息
export async function sendMessageRequest(msg: WSMessage<ChatMessage>) {
  return new Promise((resolve) => {
    const history = mockChatHistory[msg.data!.to] || [];
    history.push(msg);
    mockChatHistory[msg.data!.to] = history;
    resolve(true);
  });
}


// 消息已读
export async function markMessageRead(customerId: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const consult = mockConsultList.find((item) => item.customerId === customerId);
      if (consult) {
        consult.unread = 0;
      }
      resolve(true);
    }, 300);
  });
}