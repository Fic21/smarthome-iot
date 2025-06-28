import prisma from '@/libprisma'

export async function getLastLogByDeviceId(deviceId: string) {
  const lastLog = await prisma.deviceConnectionLog.findFirst({
    where: { deviceId },
    orderBy: { timestamp: 'desc' },
  })

  if (!lastLog) return null

  return {
    deviceId: lastLog.deviceId,
    event: lastLog.event,
    timestamp: Number(lastLog.timestamp),
  }
}
