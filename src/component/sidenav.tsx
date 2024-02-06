"use client";
import { useEffect, useState } from "react";
import { UserButton, useAuth } from "@clerk/nextjs";
import ServerIcon from "@/component/serverIcon";
import ServerCreateButton from "@/component/serverCreateButton";

export type UserServerInfo = {
  server_id: string;
  name: string;
};

export function SideNav() {
  const { userId } = useAuth();
  const [userServerInfo, setUserServerInfo] = useState<UserServerInfo[] | null>(
    null
  );
  useEffect(() => {
    const controller = new AbortController();
    const fetchServers = async () => {
      try {
        const response = await fetch(`http://localhost:/servers/${userId}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user server info");
        }
        console.log("fetch server list is success!");
        const initialServerInfo: UserServerInfo[] = await response.json();
        setUserServerInfo(initialServerInfo);
        console.log("userServerInfo:", userServerInfo);
      } catch (error) {
        // console.logは使えないので別の手段を使う
        console.error(error);
      }
    };
    fetchServers();
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <div className="pr-1.5">
      <div className="h-full flex items-center flex-col p-4  min-w-16 place-content-between bg-zinc-900 rounded-md ">
        <div className="flex flex-col gap-4">
          {userServerInfo?.map((serverInfo) => {
            return (
              <ServerIcon
                key={serverInfo.server_id}
                serverId={serverInfo.server_id}
                serverName={serverInfo.name}
                src={""}
              />
            );
          })}
          {userId && (
            <ServerCreateButton
              userId={userId}
              setUserServerInfo={setUserServerInfo}
            />
          )}
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </div>
  );
}
