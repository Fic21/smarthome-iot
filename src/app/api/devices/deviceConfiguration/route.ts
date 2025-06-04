import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");

    if (deviceId) {
      const device = await prisma.deviceConfiguration.findUnique({
        where: { deviceId },
      });
      if (!device) {
        return NextResponse.json({ error: "Device not found" }, { status: 404 });
      }
      return NextResponse.json(device, { status: 200 });
    } else {
      const devices = await prisma.deviceConfiguration.findMany();
      return NextResponse.json(devices, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      deviceId,
      name,
      topic,
      type,
      inputtambahan,
      userId,
      mqttBrokerUrl,
      mqttBrokerPort,
      mqttToken,
      mqttTokenExpiry,
    } = body;

    const newDevice = await prisma.deviceConfiguration.create({
      data: {
        deviceId,
        name,
        topic,
        type,
        inputtambahan,
        userId,
        mqttBrokerUrl,
        mqttBrokerPort,
        mqttToken,
        mqttTokenExpiry: mqttTokenExpiry ? new Date(mqttTokenExpiry) : undefined,
      },
    });

    return NextResponse.json(newDevice, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");

    if (!deviceId) {
      return NextResponse.json({ error: "Missing deviceId" }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      topic,
      type,
      inputtambahan,
      mqttBrokerUrl,
      mqttBrokerPort,
      mqttToken,
      mqttTokenExpiry,
    } = body;

    const updatedDevice = await prisma.deviceConfiguration.update({
      where: { deviceId },
      data: {
        name,
        topic,
        type,
        inputtambahan,
        mqttBrokerUrl,
        mqttBrokerPort,
        mqttToken,
        mqttTokenExpiry: mqttTokenExpiry ? new Date(mqttTokenExpiry) : undefined,
      },
    });

    return NextResponse.json(updatedDevice, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId");

  // Validasi: apakah deviceId ada dan valid (misalnya string)
  if (!deviceId || typeof deviceId !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid deviceId" },
      { status: 400 }
    );
  }

  try {
    // Cek apakah device ada
    const device = await prisma.deviceConfiguration.findUnique({
      where: { deviceId }
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    // Hapus device
    await prisma.deviceConfiguration.delete({
      where: { deviceId }
    });

    // Return sukses
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
