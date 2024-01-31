import { SideNav } from "@/component/sidenav";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <SideNav />
      {children}
    </div>
  );
}
