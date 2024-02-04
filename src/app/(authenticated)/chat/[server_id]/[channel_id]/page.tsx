import { Button } from "@/components/ui/button";
// import { Link } from "@nextui-org/react";
import Link from "next/link";
import ChannelButton from "@/component/channelButton";

import ChannelCreateButton from "@/component/channelCreateButton";

const ChannelName = ["General", "Random", "Music", "Gaming", "Anime", "Manga"];
export default async function Page() {
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
        <ChannelCreateButton />
      </div>
      <nav className="flex flex-col gap-2 py-4 px-2">
        {ChannelName.map((channelName) => {
          return (
            <ChannelButton
              channelName={channelName}
              href={`/chat/${channelName}/${channelName}`}
            />
          );
        })}
      </nav>
    </div>
  );
}
