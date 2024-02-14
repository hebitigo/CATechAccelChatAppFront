import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRef, useEffect, useState } from "react";
import { useContext } from "react";
import { ChatMessage, WebSocketContext } from "@/app/WebSocketProvider";
import ChatMessageComponent from "@/components/ChatMessage";

export default function ChatScreen({
  server_id,
  channel_id,
}: {
  server_id: string;
  channel_id: string;
}) {
  const [fetchedMessages, setFetchedMessages] = useState<ChatMessage[]>([]);
  const { ws, broadCastedChatMessage } = useContext(WebSocketContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const handleMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ws?.send(
      JSON.stringify({
        action_type: "chat_message",
        payload: {
          server_id: server_id,
          channel_id: channel_id,
          message: inputRef.current?.value,
        },
      })
    );
    inputRef.current!.value = "";
  };

  useEffect(() => {
    const controller = new AbortController();
    let response: Response;
    const fetchMessages = async () => {
      try {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/messages/${channel_id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
            cache: "no-cache",
          }
        );
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
      try {
        if (response.ok) {
          const messages: ChatMessage[] = await response.json();

          messages.sort((a, b) => {
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          });
          setFetchedMessages(messages);
        } else {
          throw new Error(
            `Failed to successfully fetch messages: ${await response.text()}`
          );
        }
      } catch (error) {
        console.error("Failed to parse response", error);
      }
    };
    fetchMessages();
    return () => {
      controller.abort();
    };
  }, []);
  //https://ja.react.dev/learn/manipulating-the-dom-with-refs#example-scrolling-to-an-element
  //https://developer.mozilla.org/ja/docs/Web/API/Element/scrollIntoView
  //refを用いたスクロール
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [fetchedMessages, broadCastedChatMessage]);
  return (
    <div className="flex flex-col h-full  p-4 grow shrink  ">
      <div className="flex flex-col gap-1 flex-1  max-w-100% overflow-y-auto">
        {fetchedMessages.map((message) => {
          return (
            <ChatMessageComponent key={message.message_id} message={message} />
          );
        })}
        {broadCastedChatMessage.map((message) => {
          return (
            <ChatMessageComponent key={message.message_id} message={message} />
          );
        })}
        <div ref={messageEndRef}></div>
      </div>
      <form className="flex gap-2" onSubmit={handleMessage}>
        <Input
          className="bg-slate border-none overflow-auto"
          placeholder="Message"
          ref={inputRef}
        />
        <Button type="submit">送信</Button>
      </form>
    </div>
  );
}
