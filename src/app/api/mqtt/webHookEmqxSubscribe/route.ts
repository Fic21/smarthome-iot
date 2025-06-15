import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      from_clientid,
      from_username,
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
    let payLoadJson: Record<string, any> | null = null;

    try {
      // Coba parse JSON biasa
      const parsed = JSON.parse(payload);
      if (typeof parsed === 'object' && parsed !== null) {
        payLoadJson = parsed;
      } else {
        payloadText = payload;
      }
    } catch {
      // Jika gagal, simpan sebagai text biasa
      payloadText = payload;
    }

    const dataToSave: any = {
      fromClientId: from_clientid,
      fromUsername: from_username,
      deviceId: clientid, // clientid disimpan sebagai deviceId di prisma
      username,
      topic,
      payloadText,
      qos,
      timestamp: BigInt(timestamp),
      node,
      event,
    };

    if (payLoadJson !== null) {
      dataToSave.payLoadJson = payLoadJson;
    }

    await prisma.deviceLogSubscriber.create({ data: dataToSave });

    return NextResponse.json({ status: 'success', message: 'Delivered log saved.' });
  } catch (error: any) {
    console.error('Error in message.delivered handler:', error);
    return NextResponse.json(
      { status: 'error', error: error.message },
      { status: 500 }
    );
  }
}
