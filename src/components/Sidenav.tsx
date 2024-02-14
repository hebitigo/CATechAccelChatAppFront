"use client";
import { useEffect, useState } from "react";
import { UserButton, useAuth } from "@clerk/nextjs";
import ServerIcon from "@/components/ServerIcon";
import ServerCreateButton from "@/components/ServerCreateButton";

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
      if (!userId) return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/servers/${userId}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user server info");
        }
        const initialServerInfo: UserServerInfo[] = await response.json();
        setUserServerInfo(initialServerInfo);
      } catch (error) {
        console.error(error);
      }
    };
    fetchServers();
    return () => {
      controller.abort();
    };
  }, [userId]);
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
