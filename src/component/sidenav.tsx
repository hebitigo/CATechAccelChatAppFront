import { Avatar, Button } from "@nextui-org/react";
import { log } from "console";
import { ReactElement } from "react";
import { UserButton, auth } from "@clerk/nextjs";
import ServerIcon from "@/component/serverIcon";
import ServerCreateButton from "@/component/serverCreateButton";

type UserServerInfo = {
  id: string;
  name: string;
};

export async function SideNav() {
  const { userId }: { userId: string | null } = auth();
  let userServerInfo: UserServerInfo[] | null = [];
  try {
    const response = await fetch(`http://localhost:8080/servers/${userId}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user server info");
    }
    console.log("fetch server list is success!");
    userServerInfo = await response.json();
    console.log("userServerInfo:", userServerInfo);
  } catch (error) {
    // console.logは使えないので別の手段を使う
    console.error(error);
  }

  return (
    <div className="pr-1.5">
      <div className="h-full flex items-center flex-col p-4  min-w-16 place-content-between bg-zinc-900 rounded-md ">
        <div className="flex flex-col gap-4">
          {userServerInfo?.map((serverInfo) => {
            return (
              <ServerIcon
                key={serverInfo.id}
                serverId={serverInfo.id}
                serverName={serverInfo.name}
              />
            );
          })}
          {userId && <ServerCreateButton userId={userId} />}
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </div>
  );
}
