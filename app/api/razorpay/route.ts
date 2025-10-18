// import axios from "axios";
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Store in .env for security
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET, // Store in .env for security
});

// const razorpayAxios = axios.create({
//   baseURL: 'https://api.razorpay.com/v1',
//   auth: {
//     username: "rzp_test_mR0rrBw15xuai1",
//     password: "OR6uEomBvCd5h0Zos7pI8QKH",
//   },
// });

export async function POST(req : Request) {
  try {
    const { amount, currency, receipt } = await req.json();

    const options = {
      amount: amount * 100, // Amount in paisa (e.g., 5000 = ₹50.00)
      currency: currency || "INR",
      receipt: receipt || `receipt#${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ status: "success", order }, { status: 200 });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ status: "error", message: "Failed to create Razorpay order" }, { status: 500 });
  }
};