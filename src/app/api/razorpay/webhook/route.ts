import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature");
  const rawBody = await req.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify webhook signature
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: {
    event: string;
    payload: { payment: { entity: { id: string; order_id: string } } };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const supabase = createAdminClient();
    await supabase
      .from("orders")
      .update({
        status: "confirmed",
        razorpay_payment_id: payment.id,
      })
      .eq("razorpay_order_id", payment.order_id);
  }

  return NextResponse.json({ received: true });
}
