import { google } from "googleapis";
import conf from "@/conf/conf";
import fs from "fs";
export function getGoogleAuth(token ?: string | undefined) {
  const refreshToken = token;

  console.log("Using refresh token from store at the Google Client:", refreshToken);

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
