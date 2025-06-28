import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const {
      clientid,
      username,
      reason,
    }: {
      clientid: string
      username?: string
      reason?: string
    } = data

    console.log(`[DISCONNECTED] Client: ${clientid}, User: ${username}, Reason: ${reason ?? 'unknown'}`)

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Error handling client.disconnected webhook:', error)
    return NextResponse.json({ status: 'error', error: (error as Error).message }, { status: 500 })
  }
}
