import { NextResponse } from "next/server";
import { google } from "googleapis";
import { v4 as uuid } from "uuid";
import { getGoogleAuth } from "@/lib/googleClient";

export async function POST(req: Request) {
  try {
    const { summary, description, startDateTime, endDateTime, attendeesList } =
    await req.json();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("tokens");
    console.log("Scheduling meet with token:", decodeURIComponent(token!)); // decodeURIComponent(token);
    const auth = getGoogleAuth(decodeURIComponent(token!));
    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary: summary || "Scheduled Meeting",
      description: description || "",
      start: {
        dateTime: startDateTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "Asia/Kolkata",
      },
      attendees: attendeesList?.map((email: string) => ({ email })) || [],
      conferenceData: {
        createRequest: {
          requestId: uuid(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    });

    const meetLink =
      response.data.conferenceData?.entryPoints?.[0]?.uri ||
      response.data.hangoutLink;

    return NextResponse.json(
      {
        status: "success",
        googleMeetLink: meetLink,
        eventId: response.data.id,
        eventHtmlLink: response.data.htmlLink,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Schedule Meet ERROR:", error);
    return NextResponse.json(
      { status: "error", message: error },
      { status: 500 }
    );
  }
}
