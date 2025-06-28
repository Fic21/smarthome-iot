import { NextRequest, NextResponse } from 'next/server'

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

    console.log(`[CONNECTED] Client: ${clientid}, User: ${username}, IP: ${ipaddress}, Keepalive: ${keepalive}, At: ${formatTimestamp(connected_at)}`)

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Error handling client.connected webhook:', error)
    return NextResponse.json({ status: 'error', error: (error as Error).message }, { status: 500 })
  }
}
