import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET
export async function GET(request: NextRequest) {
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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      deviceId,
      name,
      topic,
      type,
      // category,
      inputtambahan,
      userId,
      mqttBrokerUrl,
      mqttBrokerPort,
      mqttToken,
      mqttTokenExpiry,
    } = body;

    // Validasi sederhana wajibnya field yang penting
    if (!deviceId || !name || !topic || !type || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newDevice = await prisma.deviceConfiguration.create({
      data: {
        deviceId,
        name,
        topic,
        type,
        // category,
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
export async function PUT(request: NextRequest) {
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
      // category,
      inputtambahan,
      mqttBrokerUrl,
      mqttBrokerPort,
      mqttToken,
      mqttTokenExpiry,
    } = body;

    // Validasi wajibnya category juga di update
    if (!name || !topic || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedDevice = await prisma.deviceConfiguration.update({
      where: { deviceId },
      data: {
        name,
        topic,
        type,
        // category,
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
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");

    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid deviceId" },
        { status: 400 }
      );
    }

    const device = await prisma.deviceConfiguration.findUnique({
      where: { deviceId },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    await prisma.deviceConfiguration.delete({
      where: { deviceId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
