// src/app/api/mqtt/webHookDisconnected/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libprisma'  // pastikan path ini sesuai struktur proyekmu

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const {
      clientid,
      username,
      reason,
      disconnected_at,
    }: {
      clientid: string
      username?: string
      reason?: string
      disconnected_at?: number
    } = data

    console.log(
      `[DISCONNECTED] Client: ${clientid}, User: ${username}, Reason: ${reason ?? 'unknown'}`
    )

    await prisma.deviceConnectionLog.create({
      data: {
        deviceId: clientid,
        username: username ?? null,
        event: 'disconnected',
        reason: reason ?? null,
        ipAddress: null,
        keepalive: null,
        timestamp: BigInt(disconnected_at ?? Date.now()),
      },
    })

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Error handling client.disconnected webhook:', error)
    return NextResponse.json(
      { status: 'error', error: (error as Error).message },
      { status: 500 }
    )
  }
}
