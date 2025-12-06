import { google } from "googleapis";
import { NextResponse } from "next/server";
// import fs from "fs";
import conf from "@/conf/conf";
import DBService from "@/appwrite/db";
// import axios from "axios";
export async function GET(req: Request) {

  console.log("Google callback invoked");
  
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    conf.appUrl + "/api/google/callback" // e.g., https://yourdomain.com/api/google/callback
  );

  const { tokens } = await oauth2Client.getToken(code);

  // Save the refresh token permanently
  // if (tokens.refresh_token) {
  //   fs.writeFileSync(
  //     "google-refresh.json",
  //     JSON.stringify({ refresh_token: tokens.refresh_token }, null, 2)
  //   );
  // }

  // Update user's refresh token in the database
  if (tokens.refresh_token) {
    // await axios.post('/api/refreshToken',{
    //   refreshToken : tokens.refresh_token
    // })
    await DBService.updateRefreshToken(tokens.refresh_token);
    console.log("Google account connected successfully!");
    return NextResponse.json({
      message: "Google account connected successfully!",
      refreshTokenSaved: Boolean(tokens.refresh_token),
        
    });
  }

  return NextResponse.redirect(conf.appUrl + "/expertPanel");
}
