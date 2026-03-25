import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, orderId } = body;

    // ✅ Validate input
    if (!amount || !orderId) {
      return NextResponse.json(
        { success: false, message: "Missing amount or orderId" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 }
      );
    }

    const merchantCode = process.env.FONEPAY_MERCHANT_CODE;

    if (!merchantCode) {
      throw new Error("FONEPAY_MERCHANT_CODE missing");
    }

    // ✅ Payment payload (better structured)
    const paymentPayload = {
      merchant: merchantCode,
      amount: amount,
      orderId: orderId,
      currency: "NPR",
      timestamp: Date.now(),
    };

    // Convert to string
    const paymentString = `fonepay://pay?merchant=${merchantCode}&amount=${amount}&orderId=${orderId}`;

    // ✅ Generate QR
    const qrCodeDataURL = await QRCode.toDataURL(paymentString, {
      width: 300,
      margin: 2,
    });

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataURL,
      paymentString,
      payload: paymentPayload,
    });

  } catch (error) {
    console.error("Payment API Error:", error);

    return NextResponse.json(
      { success: false, message: error.message || "QR generation failed" },
      { status: 500 }
    );
  }
}