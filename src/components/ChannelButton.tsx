"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import clsx from "clsx";
import { usePathname } from "next/navigation";
type Props = {
  channelName: string;
  href: string;
};

export default function ChannelButton({ channelName, href }: Props) {
  const pathname = usePathname();
  return (
    <Link
      className={clsx("bg-black  truncate text-white w-full p-3 rounded-lg ", {
        "bg-slate-500": pathname === href,
      })}
      href={href}
    >
      {channelName}
    </Link>
  );
}
