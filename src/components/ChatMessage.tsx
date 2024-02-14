import { ChatMessage } from "@/app/WebSocketProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

export default function ChatMessage({ message }: { message: ChatMessage }) {
  return (
    <div
      key={message.message_id}
      className="flex w-full content-center p-2 gap-3"
    >
      <Avatar>
        <AvatarImage src={message.user_icon_image_url} />
        <AvatarFallback>{message.user_name}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex gap-2 items-center">
          <div>{message.user_name}</div>
          <div className="text-sm overflow-auto">
            {message.created_at.toString()}
          </div>
        </div>
        <div>{message.message}</div>
      </div>
    </div>
  );
}
