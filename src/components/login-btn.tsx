"use client";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function LoginBtn({ absolute = false, label = "Sign In" }) {
  return (
    <Button
      className={absolute ? "absolute right-4 top-4 md:right-8 md:top-8" : ""}
      variant={absolute ? "ghost" : undefined}
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      {label}
    </Button>
  );
}
