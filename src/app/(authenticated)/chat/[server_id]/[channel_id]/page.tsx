"use client";
import { Button } from "@/components/ui/button";
// import { Link } from "@nextui-org/react";
import Link from "next/link";
import ChannelButton from "@/component/channelButton";

import ChannelCreateButton from "@/component/channelCreateButton";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Params = {
  server_id: string;
  channel_id: string;
};

export type ChannelInfo = {
  channel_id: string;
  name: string;
};

const ChannelName = ["General", "Random", "Music", "Gaming", "Anime", "Manga"];
export default function Page() {
  const router = useRouter();
  const { server_id, channel_id } = useParams<Params>();
  // let channelInfo: ChannelInfo[] | null = [];
  const [channelInfo, setChannelInfo] = useState<ChannelInfo[] | null>(null);

  useEffect(() => {
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
            router.push(`/chat/${server_id}/${initChannelInfo[0].channel_id}`);
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
          <h2 className="text-lg font-semibold text-white">Server Name</h2>
          <Button
            className="text-white border-white bg-black"
            size="sm"
            variant="outline"
          >
            Invite
          </Button>
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
              href={`/chat/${server_id}/${channel.channel_id}`}
            />
          );
        })}
      </nav>
    </div>
  );
}
