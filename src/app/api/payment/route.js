import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount, orderId } = await req.json();

    const khaltiSecretKey = "YOUR_KHALTI_SECRET_KEY";

    const response = await fetch("https://khalti.com/api/v2/epayment/initiate/", {
      method: "POST",
      headers: {
        Authorization: `Key ${khaltiSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_url: "http://localhost:3000/payment-success",
        website_url: "http://localhost:3000",
        amount: amount * 100, // Khalti uses paisa
        purchase_order_id: orderId,
        purchase_order_name: "Food Order",
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      paymentUrl: data.payment_url,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Payment init failed" },
      { status: 500 }
    );
  }
}