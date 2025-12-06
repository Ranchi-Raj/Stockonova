import conf from "@/conf/conf";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(req : Request) {
  const { searchParams } = new URL(req.url);
  const userParam = searchParams.get("user");

  console.log("Google auth invoked", userParam);
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    conf.appUrl + "/api/google/callback"// e.g., https://yourdomain.com/api/google/callback
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/meetings.space.created",
    ],
  });

  return NextResponse.redirect(url);
}
