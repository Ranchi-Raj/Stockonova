import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getGoogleAuth } from "@/lib/googleClient";

export async function POST(req: Request) {
  try {
    const { eventId, email } = await req.json();

    if (!eventId || !email) {
      return NextResponse.json({ error: "Missing eventId or email" }, { status: 400 });
    }

    const auth = getGoogleAuth();
    const calendar = google.calendar({ version: "v3", auth });

    const updatedEvent = await calendar.events.patch({
      calendarId: "primary",
      eventId,
      sendUpdates: "all", // sends email to the invited user
      conferenceDataVersion: 1,
      requestBody: {
        attendees: [{ email }],
      },
    });

    return NextResponse.json(
      {
        status: "success",
        attendees: updatedEvent.data.attendees,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Add attendee error:", err);
    return NextResponse.json(
      { status: "error", message: err },
      { status: 500 }
    );
  }
}
