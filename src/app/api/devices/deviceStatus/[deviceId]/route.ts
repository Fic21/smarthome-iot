import { NextResponse } from 'next/server'
import { getLastLogByDeviceId } from '@/lib/getLastLogByDeviceId'

export async function GET(
  req: Request,
  context: { params: Promise<{ deviceId: string }> }
) {
  const { deviceId } = await context.params
  console.log('🔍 Fetching status for deviceId:', deviceId)

  if (!deviceId) {
    return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 })
  }

  try {
    const lastLog = await getLastLogByDeviceId(deviceId)

    if (!lastLog) {
      return NextResponse.json({ error: 'No logs found for device' }, { status: 404 })
    }

    return NextResponse.json({ lastLog })
  } catch (error) {
    console.error('❌ Error fetching device status:', error)
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 })
  }
}
