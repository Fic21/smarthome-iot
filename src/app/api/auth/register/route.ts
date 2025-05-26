import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = (await req.json()) as { name: string; email: string; password: string };

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json({ error: 'Name, email, and password are required (password min 6 chars)' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);

    if (error.code === 'P2002') { // Prisma unique constraint violation
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
