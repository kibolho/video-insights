import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/prisma";
import { openai } from "@/lib/openai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { randomUUID } from "node:crypto";
import { CODES } from "@/constants";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    // const videoCount = await prisma.video.count({
    //   where: {
    //     createdBy: {
    //       id: session.user?.id,
    //     },
    //   },
    // });
    // if (videoCount > 2) {
    //   return NextResponse.json(
    //     {
    //       error:
    //         "Você só pode enviar 2 vídeo na versão FREE, assine a versão PRO para enviando novos vídeos",
    //       code: CODES.PRO_VERSION_REQUIRED,
    //     },
    //     { status: 400 }
    //   );
    // }
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;
    const prompt = data.get("prompt") as unknown as string;

    if (!file) {
      return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
    }

    if (!(file.type === "audio/mpeg" || file.type === "audio/mp3")) {
      return NextResponse.json(
        { error: "Invalid file type, please upload a MP3" },
        { status: 400 }
      );
    }
    const name = `${randomUUID()}-${file.name}`;

    const response = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      language: "pt",
      response_format: "json",
      temperature: 0,
      prompt,
    });
    const transcription = response.text;
    const video = await prisma.video.create({
      data: {
        name: name,
        transcription,
        createdBy: {
          connect: {
            id: session.user?.id,
          },
        },
      },
    });

    return NextResponse.json({ video });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
