import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Utility function: handle internal server errors
function handleServerError(error: any) {
  console.error("Internal Server Error:", error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}

// Utility function: parse JSON safely
async function parseRequestJSON(request: NextRequest) {
  try {
    return await request.json();
  } catch (err) {
    return null;
  }
}

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
    }

    const devices = await prisma.deviceConfiguration.findMany();
    return NextResponse.json(devices, { status: 200 });
  } catch (error) {
    return handleServerError(error);
  }
}

// POST
export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestJSON(request);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const {
      deviceId,
      name,
      topic,
      type,
      category,
      inputtambahan,
      userId,
      mqttBrokerUrl,
      mqttBrokerPort,
      mqttToken,
      mqttTokenExpiry,
    } = body;

    // Validate required fields
    if (!deviceId || !name || !topic || !type || !category || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate userId exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate inputtambahan is object or undefined
    if (inputtambahan && typeof inputtambahan !== "object") {
      return NextResponse.json({ error: "Invalid inputtambahan format" }, { status: 400 });
    }

    const newDevice = await prisma.deviceConfiguration.create({
      data: {
        deviceId,
        name,
        topic,
        type,
        category,
        inputtambahan,
        userId,
        mqttBrokerUrl,
        mqttBrokerPort: mqttBrokerPort ? Number(mqttBrokerPort) : undefined,
        mqttToken,
        mqttTokenExpiry: mqttTokenExpiry ? new Date(mqttTokenExpiry) : undefined,
      },
    });

    return NextResponse.json(newDevice, { status: 201 });
  } catch (error) {
    return handleServerError(error);
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

    const body = await parseRequestJSON(request);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const {
      name,
      topic,
      type,
      category,
      inputtambahan,
      mqttBrokerUrl,
      mqttBrokerPort,
      mqttToken,
      mqttTokenExpiry,
    } = body;

    if (!name || !topic || !type || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate inputtambahan is object or undefined
    if (inputtambahan && typeof inputtambahan !== "object") {
      return NextResponse.json({ error: "Invalid inputtambahan format" }, { status: 400 });
    }

    const updatedDevice = await prisma.deviceConfiguration.update({
      where: { deviceId },
      data: {
        name,
        topic,
        type,
        category,
        inputtambahan,
        mqttBrokerUrl,
        mqttBrokerPort: mqttBrokerPort ? Number(mqttBrokerPort) : undefined,
        mqttToken,
        mqttTokenExpiry: mqttTokenExpiry ? new Date(mqttTokenExpiry) : undefined,
      },
    });

    return NextResponse.json(updatedDevice, { status: 200 });
  } catch (error) {
    return handleServerError(error);
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");

    if (!deviceId) {
      return NextResponse.json({ error: "Missing deviceId" }, { status: 400 });
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
    return handleServerError(error);
  }
}
