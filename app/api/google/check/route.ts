import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  const exists = fs.existsSync("google-refresh.json");

  return NextResponse.json({ exists });
}
