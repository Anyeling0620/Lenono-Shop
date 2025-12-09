

/* eslint-disable @typescript-eslint/no-explicit-any */
/** * WebSocket消息类型定义 * @template T - 消息数据的泛型类型 */
export type WSMessage<T = any> = {
    type:
    | 'chat_room'  // 聊天室消息
    | 'private_chat' // 私聊消息
    | 'system'  // 系统消息
    | 'notification'  // 通知消息
    | 'device_management'  // 设备管理消息
    | 'force_logout';  // 强制登出消息
    data?: T;
    meta?: Record<string, any>; //  元数据，可选，包含键值对记录
};

/** * 消息处理函数类型 * @template T - 消息数据的泛型类型 * @param msg - 接收到的WebSocket消息对象 */
export type MessageHandler<T = any> = (msg: WSMessage<T>) => void;

/** * 强制登出载荷接口 * 包含强制登出的原因和重定向地址 */
export interface ForceLogoutPayload {
    reason?: string; //  强制登出的原因，可选
    redirect?: string; //  登出后重定向的URL，可选
}




// 以下仅为参考

// /** * 聊天室消息接口 * 包含聊天室ID、消息内容、发送者信息 */
// export interface ChatRoomMessage {
//     roomId: string;
//     content: string;
//     sender: string;
// }
// /** * 私聊消息接口 * 包含发送者和接收者信息以及消息内容 */
// export interface PrivateChatMessage {
//     to: string;
//     from: string;
//     content: string;
// }
// /** * 系统消息接口 * 包含消息级别和内容 */
// export interface SystemMessage {
//     level: 'info' | 'warning' | 'error';
//     content: string;
// }

// /** * 通知消息接口 * 包含通知标题、正文和可选的操作 */
// export interface NotificationMessage {
//     title: string;
//     body: string;
//     action?: {
//         url?: string;
//         label?: string;
//     };
// }
// /** * 设备管理消息接口 * 包含设备ID、操作和可选的参数 */
// export interface DeviceManagementMessage {
//     deviceId: string;
//     action: string;
//     parameters?: Record<string, any>;
// }



// //* 示例消息对象
// const chatMessage: WSMessage<ChatRoomMessage> = {
//     type: 'chat_room',
//     data: {
//         roomId: 'room123',
//         content: 'Hello everyone!',
//         sender: 'user1'
//     },
//     meta: {
//         timestamp: Date.now(),
//         priority: 'normal'
//     }
// };



// // * 示例消息对象
// const privateMessage: WSMessage<PrivateChatMessage> = {
//     type: 'private_chat',
//     data: {
//         to: 'user2',
//         from: 'user1',
//         content: 'Private message'
//     }
// };



// // * 示例消息对象
// const systemMessage: WSMessage<SystemMessage> = {
//     type: 'system',
//     data: {
//         level: 'info',
//         content: 'System maintenance notice'
//     },
//     meta: {
//         broadcast: true,
//         persistent: true
//     }
// };



// // * 示例消息对象
// const notificationMessage: WSMessage<NotificationMessage> = {
//     type: 'notification',
//     data: {
//         title: 'New Message',
//         body: 'You have received a new message',
//         action: {
//             url: '/messages',
//             label: 'View Messages'
//         }
//     }
// };



// // * 示例消息对象
// const deviceMessage: WSMessage<DeviceManagementMessage> = {
//     type: 'device_management',
//     data: {
//         deviceId: 'device123',
//         action: 'update_settings',
//         parameters: {
//             brightness: 80,
//             volume: 50
//         }
//     },
//     meta: {
//         requiresAck: true,
//         timeout: 5000
//     }
// };

