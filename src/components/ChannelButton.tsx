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
    <Button
      asChild
      className={clsx("justify-start gap-2  bg-black text-white", {
        "bg-slate-500": pathname === href,
      })}
      size="lg"
      variant="ghost"
    >
      <Link className="gap-2 truncate text-white w-full" href={href}>
        {channelName}
      </Link>
    </Button>
  );
}
