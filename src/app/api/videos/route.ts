import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/../prisma/prisma";
import { openai } from '@/lib/openai';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/auth';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import ytdl from 'ytdl-core'
import { createReadStream, createWriteStream } from 'node:fs';
import tmp from 'tmp';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthenticated" },{ status: 401 })
    }
    
    const bodySchema = z.object({
      shortsURL: z.string()
    })
    const body = await req.json();

    const {shortsURL} = bodySchema.parse(body);
    const regex = /https:\/\/www\.youtube\.com\/shorts\/([^\/]+)\/?/; 
    const match = shortsURL.match(regex);
    if(!match) {
      return NextResponse.json({ error: "Invalid URL" },{ status: 400 })
    }
    const id = match[1];
    const file = ytdl(shortsURL, {quality: 'lowestaudio', filter: "audioonly"})
    const name = `${randomUUID()}-${id}`
    const tmpobj = tmp.fileSync(); 
    file.pipe(createWriteStream(tmpobj.name));

    const response = await openai.audio.transcriptions.create({
      file: createReadStream(tmpobj.name),
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0,
    })
    const transcription = response.text
    const video = await prisma.video.create({
      data:{
        name: name,
        transcription,
        createdBy: {
          connect:{
            id: session.user?.id
          }
        }
      }
    })
    return NextResponse.json({ video })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" },{ status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) 
      return NextResponse.json({ error: "Unauthenticated" },{ status: 401 })
  
    const prompts = await prisma.video.findMany({
      where:{
        createdBy: {
          id: session.user?.id
        }
      }
    });
    return NextResponse.json(prompts)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal Server Error" },{ status: 500 })
  }
}