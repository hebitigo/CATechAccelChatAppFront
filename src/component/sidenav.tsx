import { Avatar, Button } from "@nextui-org/react";
import { log } from "console";
import { ReactElement } from "react";

type UserServerInfo = {
  id: string;
  name: string;
};

export async function SideNav() {
  const userId = "userId1";
  try {
    const response = await fetch(
      `http://localhost:3000/api/getServers/${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user server info");
    }
    const userServerInfo: UserServerInfo[] = await response.json();
  } catch (error) {
    // console.logは使えないので別の手段を使う
    console.error(error);
  }

  return (
    <div className="h-full flex items-center flex-col p-4 gap-4 min-w-16">
      {/* <Avatar size="lg" radius="md" showFallback name="server1" src="test" />
      <Avatar
        size="lg"
        radius="md"
        showFallback
        fallback="server2"
        src="test"
        as="button"
      ></Avatar> */}
      {userServerInfo.map((serverInfo) => {
        return (
          <Avatar
            key={serverInfo.id}
            size="lg"
            radius="md"
            showFallback
            name={serverInfo.name}
            src="test"
            as="button"
          ></Avatar>
        );
      }
    }
    </div>
  );
}
