export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center items-center  h-screen bg-slate-800">
      {children}
    </div>
  );
}
