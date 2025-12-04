import { google } from "googleapis";
import fs from "fs";
import conf from "@/conf/conf";

export function getGoogleAuth() {
  let refreshToken = null;

  if (fs.existsSync("google-refresh.json")) {
    refreshToken = JSON.parse(
      fs.readFileSync("google-refresh.json", "utf8")
    ).refresh_token;
  }

  if (!refreshToken) {
    throw new Error(
      "Refresh token missing. Visit /api/google/auth to connect your Google account."
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    conf.appUrl + "/api/google/callback" // e.g., https://yourdomain.com/api/google/callback
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}
