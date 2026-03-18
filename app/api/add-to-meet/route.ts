import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getGoogleAuth } from "@/lib/googleClient";
// import conf from "@/conf/conf";
// async function sendInviteEmail(email: string, eventDetails: {
//   summary: string;
//   start: { dateTime?: string; date?: string };
//   end: { dateTime?: string; date?: string };
//   location?: string;
//   description?: string;
// }) {
//   const start = eventDetails.start?.dateTime || eventDetails.start?.date;
//   const end = eventDetails.end?.dateTime || eventDetails.end?.date;

//   await fetch(`${conf.appUrl}/api/send-email`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       to: email,
//       subject: `You're invited: ${eventDetails.summary}`,
//       text: `
//         You've been invited to an event.

//         Event: ${eventDetails.summary}
//         Start: ${start}
//         End: ${end}
//         ${eventDetails.location ? `Location: ${eventDetails.location}` : ""}
//         ${eventDetails.description ? `Description: ${eventDetails.description}` : ""}
//       `,
//     }),
//   });
// }

export async function POST(req: Request) {
  try {
    const { eventId, email } = await req.json();

    if (!eventId || !email) {
      return NextResponse.json(
        { error: "Missing eventId or email" },
        { status: 400 }
      );
    }

    const token = new URL(req.url).searchParams.get("token");
    const auth = getGoogleAuth(decodeURIComponent(token!));
    const calendar = google.calendar({ version: "v3", auth });

    //  STEP 1: Get existing event
    const existingEvent = await calendar.events.get({
      calendarId: "primary",
      eventId,
    });

    const existingAttendees = existingEvent.data.attendees || [];

    //  STEP 2: Avoid duplicate
    const alreadyExists = existingAttendees.some(
      (att) => att.email === email
    );

    if (!alreadyExists) {
      existingAttendees.push({ email });
    }

    //  Update with FULL list
    const updatedEvent = await calendar.events.patch({
      calendarId: "primary",
      eventId,
      sendUpdates: "all",
      conferenceDataVersion: 1,
      requestBody: {
        attendees: existingAttendees,
      },
    });

    // sendInviteEmail(email, {
    //   summary: updatedEvent.data.summary || "No title",
    //   start: updatedEvent.data.start || {},
    //   end: updatedEvent.data.end || {},
    //   location: updatedEvent.data.location || "",
    //   description: updatedEvent.data.description || "",
    // });
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