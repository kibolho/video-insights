import prisma from "@/../prisma/prisma";
import { authOptions } from '@/lib/auth';
import { getServerSession } from "next-auth/next";
import { NextResponse } from 'next/server';

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