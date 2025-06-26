import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "rahasia_super_secret";

export async function POST(req: NextRequest) {
  try {
    const { userId, clientid, topic, type } = await req.json();

    if (!userId || !topic || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Token expire dalam 1 jam (3600 detik)
    const expiresIn = 3600;

    const payload = {
      userId,
      clientid,
      topic,
      type,
    };

    const token = jwt.sign(payload, SECRET, { expiresIn });

    const expiry = new Date(Date.now() + expiresIn * 1000).toISOString();

    return NextResponse.json({ token, expiry });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
