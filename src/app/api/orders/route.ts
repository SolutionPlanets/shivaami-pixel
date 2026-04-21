import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcSavings, getDiscountPct } from "@/lib/marketplace";

interface OrderItem {
  productSlug: string;
  productName: string;
  colorName: string;
  quantity: number;
  unitPriceInr: number;
}

interface OrderRequestBody {
  form: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    gstNumber?: string;
    city: string;
    notes?: string;
    paymentMode: "pay_now" | "invoice";
  };
  items: OrderItem[];
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export async function POST(req: NextRequest) {
  let body: OrderRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { form, items } = body;

  // Basic validation
  if (
    !form?.companyName?.trim() ||
    !form?.email?.trim() ||
    !items?.length
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Verify Razorpay signature for pay_now orders
  if (form.paymentMode === "pay_now") {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing payment data" },
        { status: 400 }
      );
    }
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
    if (expected !== razorpaySignature) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }
  }

  // Calculate totals
  const calcItems = items.map((i) => ({
    slug: i.productSlug,
    quantity: i.quantity,
    unitPriceInr: i.unitPriceInr,
  }));
  const summary = calcSavings(calcItems);
  const totalInr = summary.effectivePrice;
  const totalPaise = totalInr * 100;

  const supabase = createAdminClient();

  // Insert order row
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      company_name: form.companyName,
      contact_name: form.contactName,
      email: form.email,
      phone: form.phone,
      gst_number: form.gstNumber || null,
      city: form.city,
      notes: form.notes || null,
      payment_mode: form.paymentMode,
      status:
        form.paymentMode === "pay_now" ? "confirmed" : "invoice_requested",
      razorpay_order_id: body.razorpayOrderId || null,
      razorpay_payment_id: body.razorpayPaymentId || null,
      total_amount: totalPaise,
      total_inr: totalInr,
      user_id: null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Order insert error:", orderError);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }

  // Insert order items
  const orderItemRows = items.map((item) => ({
    order_id: order.id,
    product_slug: item.productSlug,
    product_name: item.productName,
    color_name: item.colorName,
    quantity: item.quantity,
    unit_price: item.unitPriceInr * 100, // paise
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemRows);

  if (itemsError) {
    // Order was saved — log but don't fail the response
    console.error("Order items insert error:", itemsError);
  }

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
