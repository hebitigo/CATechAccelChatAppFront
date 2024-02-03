"use client";

import { Avatar } from "@nextui-org/react";

type Props = {
  serverId: string;
  serverName: string;
};

export default function ServerIcon({ serverId, serverName }: Props) {
  return (
    <Avatar
      color="secondary"
      size="lg"
      radius="md"
      showFallback
      fallback={<p className="font-bold">{serverName}</p>}
      as="button"
      onClick={() => {
        console.error(`${serverId}`);
      }}
    />
  );
}
