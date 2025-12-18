import { createContext } from "react";
import type { WSMessage } from "./types";
import type { MessageRouter } from "./messageRouter";
import type { ReadyState } from "react-use-websocket";

 interface WSContextValue {
  send: (msg: WSMessage) => void;
  router: MessageRouter;
  readyState: ReadyState;
  isLeader: boolean;
  disconnect: () => void | undefined;
}
export const WSContext = createContext<WSContextValue|null>(null);
//  创建一个 WebSocket 上下文，初始值为 null，类型为 any

