import { createContext } from "react";
import type { WSMessage } from "./types";
import type { MessageRouter } from "./messageRouter";

 interface WSContextValue {
  send: (msg: WSMessage) => void;
  router: MessageRouter;
  readyState: import("D:/my-app-project/lenovo-shop/node_modules/.pnpm/react-use-websocket@4.13.0/node_modules/react-use-websocket/dist/lib/constants").ReadyState;
  isLeader: boolean;
  disconnect: () => void | undefined;
}
export const WSContext = createContext<WSContextValue|null>(null); 
//  创建一个 WebSocket 上下文，初始值为 null，类型为 any

