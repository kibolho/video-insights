

import prisma from "@/../prisma/prisma";
import { authOptions } from '@/lib/auth';
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest,res: NextResponse) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) 
    return NextResponse.json({ error: "Unauthenticated" },{ status: 401 })

  const prompts = await prisma.prompt.findMany();
  return NextResponse.json(prompts)
}