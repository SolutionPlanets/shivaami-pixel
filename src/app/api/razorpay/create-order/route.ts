import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  let body: { amountInr: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { amountInr } = body;
  if (!amountInr || amountInr < 1) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amountInr * 100, // paise
      currency: "INR",
      receipt: `b2b_${Date.now()}`,
      notes: { source: "shivaami_b2b_marketplace" },
    });

    return NextResponse.json({
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
