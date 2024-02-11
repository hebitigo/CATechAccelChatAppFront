import Link from "next/link";

type Props = {
  serverName: string;
  serverId: string;
  src: string;
};

export default function ServerIcon({ serverName, src, serverId }: Props) {
  return (
    <Link
      href={`/chat/${serverId}/init`}
      className="overflow-hidden h-[55px] w-[55px] bg-slate-800  rounded-lg"
    >
      {src ? (
        <img src={src} className="object-cover w-full h-full" />
      ) : (
        <span className="overflow-hidden    text-slate-200 ">{serverName}</span>
      )}
    </Link>
  );
}
