
import type { WSMessage, MessageHandler } from "./types";

/**
 * MessageRouter 是一个消息路由管理类，用于处理和分发消息到相应的处理器。
 * 该类支持按消息类型注册特定的处理器，也支持注册通用的消息处理器。
 * 
 * 核心功能：
 * - 注册和注销特定类型的消息处理器
 * - 注册和注销通用消息处理器（处理所有类型的消息）
 * - 分发消息到对应的处理器
 * - 清除所有处理器
 * 
 * @example
 * const router = new MessageRouter();
 * 
 * // 注册特定类型的处理器
 * const unsubscribe = router.on('message', (msg) => {
 *   console.log('Received message:', msg);
 * });
 * 
 * // 注册通用处理器
 * router.onAny((msg) => {
 *   console.log('Received any message:', msg);
 * });
 * 
 * // 分发消息
 * router.dispatch({ type: 'message', data: 'Hello' });
 * 
 * // 取消订阅
 * unsubscribe();
 */
export class MessageRouter {
    private handlers = new Map<string, Set<MessageHandler>>(); //  私有属性：handlers，用于存储特定消息类型的处理器集合 使用Map结构，键为消息类型字符串，值为Set集合，存储MessageHandler类型的处理器
    private anyHandlers = new Set<MessageHandler>(); //  私有属性：anyHandlers，用于存储不限定消息类型的通用处理器 使用Set结构，存储MessageHandler类型的处理器

    /**
     * 为指定类型的事件注册处理器
     * @param {string} type - 事件类型名称
     * @param {MessageHandler} handler - 事件处理函数
     * @returns {Function} 返回一个取消注册的函数，调用后可以移除该事件处理器
     * @example
     * const unsubscribe = on('message', (data) => {
     *   console.log('Received:', data);
     * });
     * // 稍后取消订阅
     * unsubscribe();
     */
    on(type: string, handler: MessageHandler) {
        const set = this.handlers.get(type) || new Set();
        set.add(handler);
        this.handlers.set(type, set);
        return () => this.off(type, handler);
    }

    /**
     * 移除指定类型的事件监听器。
     * @param type - 要移除监听器的事件类型。
     * @param handler - 要移除的事件处理函数。
     * @returns {void}
     */
    off(type: string, handler: MessageHandler) {
        // 从handlers Map中获取指定类型的处理函数集合
        const set = this.handlers.get(type);
        // 如果该类型没有注册的处理函数，则直接返回
        if (!set) return;
        // 从集合中删除指定的处理函数
        set.delete(handler);
        // 如果该类型的处理函数集合已为空，则从handlers中删除该类型
        if (set.size === 0) this.handlers.delete(type);
    }

    /**
     * 注册一个全局消息处理器，用于处理所有类型的消息
     * @param handler - 消息处理函数，将被添加到全局处理器集合中
     * @returns 返回一个取消订阅函数，调用后会从全局处理器集合中移除该处理器
     */
    onAny(handler: MessageHandler) {
        this.anyHandlers.add(handler);  // 将处理器添加到全局处理器集合中
        return () => this.anyHandlers.delete(handler);  // 返回一个函数，用于移除已添加的处理器
    }

    /**
     * 移除所有消息类型的处理器
     * @param handler - 要移除的消息处理器函数
     */
    offAny(handler: MessageHandler) {
        // 从anyHandlers集合中删除指定的处理器
        this.anyHandlers.delete(handler);
    }

    /**
     * 消息分发方法，根据消息类型将消息分发给对应的处理器
     * @param msg - 需要分发的WebSocket消息对象
     */
    dispatch(msg: WSMessage) {
        // 从消息对象中解构出消息类型
        const { type } = msg;
        // 检查是否存在对应类型的处理器
        if (this.handlers.has(type)) {
            // 如果存在，遍历所有该类型的处理器并依次调用
            for (const h of this.handlers.get(type)!) {
                h(msg);
            }
        }
        // 遍历所有通用类型的处理器（不关心消息类型的处理器）
        for (const h of this.anyHandlers) {
            h(msg);
        }
    }

    /**
     * 清除所有事件处理程序
     * 该方法会清空 handlers 和 anyHandlers 两个集合中的所有处理函数
     */
    clear() {
        // 清除特定事件的处理程序集合
        this.handlers.clear();
        // 清除通配符事件的处理程序集合
        this.anyHandlers.clear();
    }
}
