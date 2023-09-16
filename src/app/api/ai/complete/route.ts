
import prisma from "@/../prisma/prisma";
import { authOptions } from '@/lib/auth';
import { openai } from '@/lib/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest,res: NextResponse) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthenticated" },{ status: 401 })
    }
    const body = await req.json();

    const bodySchema = z.object({
      videoId: z.string().uuid(),
      prompt: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    })
    const {videoId, prompt, temperature} = bodySchema.parse(body);
    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId
      },
    })
    if(!video.transcription) {
      return NextResponse.json({ error: "Video transcription was not generated yet." },{ status: 400 })
    }
    const promptMessage = prompt.replace("{transcription}", video.transcription)
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature,
      messages: [
        { role: 'user', content: promptMessage }
      ],
      stream: true
    })
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" },{ status: 500 })
  }
  
}