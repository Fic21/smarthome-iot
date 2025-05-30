import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), "components", "CardConfiguration");
    const files = fs.readdirSync(dirPath);

    const componentNames = files
      .filter((file) => file.endsWith(".tsx") || file.endsWith(".jsx"))
      .map((file) => file.replace(/\.(tsx|jsx)$/, ""));

    return NextResponse.json(componentNames);
  } catch (error) {
    console.error("Error reading folder:", error);
    return NextResponse.json({ error: "Failed to read folder" }, { status: 500 });
  }
}
