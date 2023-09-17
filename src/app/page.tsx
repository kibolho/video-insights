"use client";
import { useRouter } from "next/navigation";
import LoginBtn from "../components/login-btn";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Spinner } from "@/components/spinner";

export default function AuthenticationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status !== "unauthenticated") return <Spinner />;
  return (
    <div className="container relative hidden min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
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
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Video Insights me economizou inúmeras horas de trabalho e
              me ajudou a entregar vídeos com mais informações e
              detalhes.&rdquo;
            </p>
            <footer className="text-sm">
              Youtuber famoso em um futuro próximo
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
          </div>
          <LoginBtn />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao continuar, você concorda com nossos{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Termos de serviço
            </Link>{" "}
            e{" "}
            <Link
              href="/privacy-policy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Politica de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
