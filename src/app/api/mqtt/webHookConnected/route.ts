// src/app/api/mqtt/webHookConnected/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/libprisma'  // pastikan path ini sesuai struktur proyekmu

function formatTimestamp(timestamp?: number): string {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  return date.toISOString()
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const {
      clientid,
      username,
      ipaddress,
      keepalive,
      connected_at,
    }: {
      clientid: string
      username?: string
      ipaddress?: string
      keepalive?: number
      connected_at?: number
    } = data

    console.log(
      `[CONNECTED] Client: ${clientid}, User: ${username}, IP: ${ipaddress}, Keepalive: ${keepalive}, At: ${formatTimestamp(connected_at)}`
    )

    await prisma.deviceConnectionLog.create({
      data: {
        deviceId: clientid,
        username: username ?? null,
        event: 'connected',
        reason: null,
        ipAddress: ipaddress ?? null,
        keepalive: keepalive ?? null,
        timestamp: BigInt(connected_at ?? Date.now()),
      },
    })

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Error handling client.connected webhook:', error)
    return NextResponse.json(
      { status: 'error', error: (error as Error).message },
      { status: 500 }
    )
  }
}
