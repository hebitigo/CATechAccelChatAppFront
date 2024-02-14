"use client";
import { Button } from "@/components/ui/Button";
import ChannelButton from "@/components/ChannelButton";
import ChatScreen from "@/components/ChatScreen";
import ChannelCreateButton from "@/components/ChannelCreateButton";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { WebSocketContext } from "@/app/WebSocketProvider";
import isEqual from "lodash/isEqual";

type Params = {
  server_id: string;
  server_name: string;
  channel_id: string;
};

export type ChannelInfo = {
  channel_id: string;
  name: string;
};

const ChannelName = ["General", "Random", "Music", "Gaming", "Anime", "Manga"];
export default function Page() {
  const { setChannelId, setServerId } = useContext(WebSocketContext);
  const { user } = useUser();

  const router = useRouter();
  const { server_id, server_name, channel_id } = useParams<Params>();
  useEffect(() => {
    setChannelId(channel_id);
    setServerId(server_id);
  }, [channel_id, server_id]);
  const [channelInfo, setChannelInfo] = useState<ChannelInfo[] | null>(null);

  const decodedServerName = decodeURIComponent(server_name);

  type InviteToken = {
    token: string;
  };
  const generateInviteTokenAndCopyToClipboard = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/server/create/invitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user?.id,
            server_id: server_id,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to generate invite token");
      }
      const data: InviteToken = await response.json();
      await navigator.clipboard.writeText(data.token);
      toast({
        title: "Invite token copyed!",
      });
    } catch (error) {
      console.error("error occured while generate invite server tokne:", error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchChannelInfo = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/channels/${server_id}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch channel info");
        }
        const initChannelInfo: ChannelInfo[] = await response.json();

        if (controller.signal.aborted) return;
        setChannelInfo(initChannelInfo);

        if (
          initChannelInfo?.some((channel) => channel.channel_id === channel_id)
        ) {
          return;
        }
        //initChannelInfoにfetchされた結果として[]が入った場合/chat/${server_name}/${server_id}/にrouter.pushが行われることになるので、
        //チャンネル情報自体が配列に入っているかを確認するためにif文を書いています
        router.push(
          `/chat/${server_name}/${server_id}/${initChannelInfo[0].channel_id}`
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchChannelInfo();
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <>
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="flex border-b border-gray-700 flex-col p-4 gap-4">
          <div className="  flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">
              {decodedServerName}
            </h2>
            <div>
              {user && (
                <Button
                  className="text-white border-white bg-black"
                  size="sm"
                  variant="outline"
                  onClick={generateInviteTokenAndCopyToClipboard}
                >
                  Invite
                </Button>
              )}
              <Toaster />
            </div>
          </div>
          <ChannelCreateButton
            serverId={server_id}
            setChannelInfo={setChannelInfo}
          />
        </div>
        <nav className="flex flex-col gap-2 py-4 px-2">
          {channelInfo?.map((channel) => {
            return (
              <ChannelButton
                key={channel.channel_id}
                channelName={channel.name}
                href={`/chat/${server_name}/${server_id}/${channel.channel_id}`}
              />
            );
          })}
        </nav>
      </div>
      <ChatScreen server_id={server_id} channel_id={channel_id} />
    </>
  );
}
