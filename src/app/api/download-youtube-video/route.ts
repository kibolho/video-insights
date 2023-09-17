import prisma from "@/../prisma/prisma";
import { authOptions } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { convertMP4AudioToMP3Audio } from "./convert";
import { downloadYoutubeVideo } from "./download";
import { createReadStream } from "fs";
import { CODES } from "@/constants";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    const regex = /https:\/\/www\.youtube\.com\/shorts\/([^\/]+)\/?/;
    const bodySchema = z.object({
      shortsURL: z.string().url().regex(regex),
    });
    const body = await req.json();
    const result = bodySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const videoCount = await prisma.video.count({
      where: {
        createdBy: {
          id: session.user?.id,
        },
      },
    });
    if (videoCount > 2) {
      return NextResponse.json(
        {
          error:
            "Você só pode enviar 2 vídeo na versão FREE, assine a versão PRO para enviando novos vídeos",
          code: CODES.PRO_VERSION_REQUIRED,
        },
        { status: 400 }
      );
    }

    const audioPath = "./tmp/audio.mp4";
    const audioOutputPath = "./tmp/audio.mp3";
    await downloadYoutubeVideo(body.shortsURL, audioPath);
    await convertMP4AudioToMP3Audio(audioPath, audioOutputPath);
    console.log("Enviando o audio...");
    const response = await openai.audio.transcriptions.create({
      file: createReadStream(audioOutputPath),
      model: "whisper-1",
      language: "pt",
      response_format: "json",
      temperature: 0,
    });

    const name = body.shortsURL;
    const transcription = response.text;
    const video = await prisma.video.create({
      data: {
        name,
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
