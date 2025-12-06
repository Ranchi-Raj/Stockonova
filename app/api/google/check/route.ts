import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userParam = searchParams.get("user");

  console.log("Raw user param:", userParam);

  const decoded = userParam ? decodeURIComponent(userParam) : "";
  console.log("Decoded user:", decoded);

  const user = decoded ? JSON.parse(decoded) : null;

  const exists = !!user?.refreshToken;

  return NextResponse.json({ exists });
}
