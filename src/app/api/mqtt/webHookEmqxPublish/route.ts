import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clientid,
      username,
      topic,
      payload,
      qos,
      timestamp,
      node,
      event,
    } = body;

    let payloadText: string | null = null;
    let payloadJson: Record<string, any> | null = null;

    try {
      const parsed = JSON.parse(payload);
      if (typeof parsed === 'object' && parsed !== null) {
        payloadJson = parsed;
      } else {
        payloadText = payload;
      }
    } catch {
      payloadText = payload;
    }

    await prisma.deviceLogPublisher.create({
      data: {
        deviceId: clientid,
        username,
        topic,
        payloadText,
        qos,
        timestamp: BigInt(timestamp),
        node,
        event,
        ...(payloadJson !== null && { payLoadJson: payloadJson }),
      },
    });

    return NextResponse.json({ status: 'success', message: 'Publish log saved.' });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
