import {NextResponse} from "next/server";
import { sendMail as emailService } from "@/utils/email";

export async function POST(request: Request) {
  const { to, subject, text } = await request.json();

  try {
    await emailService({ to, subject, text });
    console.log("Email sent successfully from /api/send-email");
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/send-email:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}