"use client";

import { useUser } from "@clerk/nextjs";
import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  MutableRefObject,
  use,
  useCallback,
} from "react";
import { set } from "react-hook-form";

export type ChatMessage = {
  message_id: string;
  user_name: string;
  user_icon_image_url: string;
  server_id: string;
  channel_id: string;
  message: string;
  created_at: Date;
};

type BroadCastedPayload = {
  action_type: "chat_message";
  payload: any;
};

type ContextData = {
  setUserId: Dispatch<SetStateAction<string>>;
  setChannelId: Dispatch<SetStateAction<string>>;
  setServerId: Dispatch<SetStateAction<string>>;
  ws: WebSocket | null;

  //   userIdRef:MutableRefObject<string | undefined>
  //   channelIdRef:MutableRefObject<string | undefined>
  //   serverIdRef:MutableRefObject<string | undefined>
  broadCastedChatMessage: ChatMessage[];
};

export const WebSocketContext = createContext<ContextData>({
  setUserId: () => {},
  setChannelId: () => {},
  setServerId: () => {},
  ws: null,
  broadCastedChatMessage: [],
});

export function WebsocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [boradCastedChannelChatMessage, setBroradCastedChannelChatMessage] =
    useState<ChatMessage[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const handlePayload = useCallback(
    (payload: BroadCastedPayload) => {
      if (payload.action_type === "chat_message") {
        const message: ChatMessage = payload.payload;
        if (
          message.server_id === serverId &&
          message.channel_id === channelId
        ) {
          setBroradCastedChannelChatMessage((prev) => [...prev, message]);
        }
      }
    },
    [serverId, channelId]
  );

  //wsの初期化処理
  useEffect(() => {
    if (user?.id === undefined) return;
    console.log("userId:", user.id);
    setWs(
      new WebSocket(
        `${process.env.NEXT_PUBLIC_BACKEND_WS_ORIGIN}/ws/${user.id}`
      )
    );
    return () => {
      setWs(null);
    };
  }, [user]);

  //wsのイベントリスナーの設定
  useEffect(() => {
    if (ws === null) return;

    ws.onopen = () => {
      console.log("websocket connected! user:", user?.id);
    };

    ws.onclose = () => {
      console.log("websocket closed");
      if (user === undefined) return;
      setWs(
        new WebSocket(
          `${process.env.NEXT_PUBLIC_BACKEND_WS_ORIGIN}/ws/${user?.id}`
        )
      );
    };
    ws.onmessage = (event) => {
      const data: BroadCastedPayload = JSON.parse(event.data);
      console.log("message received!:", data);
      handlePayload(data);
    };

    ws.onerror = (error) => {
      console.error("websocket error:", error);
    };
    return () => {
      ws.close();
    };
  }, [ws]);
  //channelが切り替わったときにonmessageのイベントリスナーを設定し直すようにしないと
  //context経由でsetServerId,setChannelIdを用いて設定しなおしたIdが変更されても
  //wsを第二引数に指定しているuseEffectが再実行されないため、onmessageのイベントリスナー中に使われている
  //channelId,serverが変更されない
  useEffect(() => {
    setBroradCastedChannelChatMessage([]);

    if (ws === null) return;
    ws.onmessage = (event) => {
      const data: BroadCastedPayload = JSON.parse(event.data);
      console.log("message received!:", data);
      handlePayload(data);
    };
  }, [channelId]);

  return (
    <WebSocketContext.Provider
      value={{
        setUserId: setUserId,
        setServerId: setServerId,
        setChannelId: setChannelId,
        ws: ws,
        broadCastedChatMessage: boradCastedChannelChatMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
