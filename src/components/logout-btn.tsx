"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function LogoutBtn() {
  return <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</Button>;
}
