"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function LoginBtn({ absolute = false, label="Sign In"}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (!session?.user?.isActive) {
        return router.push("/dashboard");
      }
      return router.push("/dashboard");
    }
  }, [status, session]);

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Button
          className={
            absolute ? "absolute right-4 top-4 md:right-8 md:top-8" : ""
          }
          variant={absolute ? "ghost" : undefined}
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          {label}
        </Button>
      </>
    );
  }
}
