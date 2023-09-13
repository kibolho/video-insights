"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const baseBtnStyle ="bg-slate-100 hover:bg-slate-200 text-black px-6 py-2 rounded-md capitalize font-bold mt-1";

export default function LoginBtn() {
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
        <button
          className={baseBtnStyle}
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Sign in
        </button>
      </>
    );
  }
}
