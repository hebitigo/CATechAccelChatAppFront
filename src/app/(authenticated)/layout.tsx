import { SideNav } from "@/components/Sidenav";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex   h-screen bg-slate-800">
      <SideNav />
      {children}
    </div>
  );
}
