import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // sesuaikan path import prisma client kamu

// GET: ambil logs, filter deviceId wajib, optional filter startDate dan endDate
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("deviceId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!deviceId) {
      return NextResponse.json({ error: "Missing deviceId" }, { status: 400 });
    }

    const where: any = { deviceId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const logs = await prisma.deviceLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/deviceLog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: tambah log baru, deviceId + timestamp + logData wajib
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Cek apakah body array atau objek tunggal
    const logs = Array.isArray(body) ? body : [body];

    // Validasi semua logs wajib punya deviceId, timestamp, logData
    for (const log of logs) {
      if (!log.deviceId || !log.timestamp || !log.logData) {
        return NextResponse.json(
          { error: "Each log must have deviceId, timestamp, and logData" },
          { status: 400 }
        );
      }
    }

    if (logs.length === 1) {
      // Insert 1 log
      const newLog = await prisma.deviceLog.create({
        data: {
          deviceId: logs[0].deviceId,
          timestamp: new Date(logs[0].timestamp),
          logData: logs[0].logData,
        }
      });
      return NextResponse.json(newLog, { status: 201 });
    } else {
      // Insert banyak log sekaligus dengan createMany
      const dataToInsert = logs.map(log => ({
        deviceId: log.deviceId,
        timestamp: new Date(log.timestamp),
        logData: log.logData,
      }));

      await prisma.deviceLog.createMany({
        data: dataToInsert,
        skipDuplicates: true, // opsional: skip jika ada duplikat
      });

      return NextResponse.json({ message: `${logs.length} logs created` }, { status: 201 });
    }
  } catch (error) {
    console.error("POST /api/deviceLog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: hapus semua log berdasarkan deviceId
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("deviceId");

    if (!deviceId) {
      return NextResponse.json({ error: "Missing deviceId" }, { status: 400 });
    }

    await prisma.deviceLog.deleteMany({
      where: { deviceId }
    });

    return NextResponse.json({ message: `All logs for deviceId=${deviceId} deleted` });
  } catch (error) {
    console.error("DELETE /api/deviceLog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
