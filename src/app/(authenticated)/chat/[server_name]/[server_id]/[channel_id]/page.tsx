"use client";
import { Button } from "@/components/ui/Button";
import ChannelButton from "@/components/ChannelButton";

import ChannelCreateButton from "@/components/ChannelCreateButton";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

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
  //dynamic paramが変わっても再レンダリングされない
  const { user } = useUser();

  const router = useRouter();
  const { server_id, server_name, channel_id } = useParams<Params>();
  const [channelInfo, setChannelInfo] = useState<ChannelInfo[] | null>(null);

  const [isCopied, setIsCopied] = useState(false);

  const decodedServerName = decodeURIComponent(server_name);

  type InviteToken = {
    token: string;
  };
  const generateInviteTokenAndCopyToClipboard = () => {
    fetch("http://localhost:8080/server/create/invitation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user?.id,
        server_id: server_id,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          console.log("token generate success!");
          const inviteToken: InviteToken = await response.json();
          await navigator.clipboard.writeText(inviteToken.token);
          setIsCopied(true);
          toast({
            title: "Invite token copyed!",
          });
        } else {
          const message = await response.text();
          throw Error(message);
        }
      })
      .catch((error) => {
        console.error(
          "error occured while generate invite server tokne:",
          error
        );
      });
  };

  //websocketで情報を受け取ってstateの配列に追加
  //channel_idなどをuseEffectの第二引数に渡してdynamic paramが変更されてチャンネル
  //が切り替わったときにcontextに保持している配列を初期化するような
  //hooksを実行させる
  useEffect(() => {
    console.log("server name is ", server_name);
    const controller = new AbortController();
    const fetchChannelInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/channels/${server_id}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch channel info");
        }
        console.log("fetch channel list is success!");
        const initChannelInfo: ChannelInfo[] = await response.json();
        setChannelInfo(initChannelInfo);

        console.log("channelInfo:", channelInfo);
        if (
          !initChannelInfo?.some((channel) => channel.channel_id === channel_id)
        ) {
          if (initChannelInfo?.[0]) {
            router.push(
              `/chat/${server_name}/${server_id}/${initChannelInfo[0].channel_id}`
            );
          }
        }
      } catch (error) {
        // console.logは使えないので別の手段を使う
        console.error(error);
      }
    };
    fetchChannelInfo();
    return () => {
      controller.abort();
    };
  }, []);
  return (
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
  );
}
