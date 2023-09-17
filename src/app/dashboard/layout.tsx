"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutBtn from "../../components/logout-btn";
import { Separator } from "../../components/ui/separator";
import { getInitials } from "@/lib/utils";
import { Spinner } from "@/components/spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      return router.push("/");
    }
  }, [status, session, router]);

  if (status !== "authenticated") return <Spinner />;
  return (
    <section className="">
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Video Insights
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 💜 no NLW da Rocketseat
          </span>
          <Separator orientation="vertical" className="h-6" />
          <Avatar>
            <AvatarImage src={session.user?.image || undefined} />
            <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
          </Avatar>
          <LogoutBtn />
        </div>
      </nav>

      {children}
    </section>
  );
}
