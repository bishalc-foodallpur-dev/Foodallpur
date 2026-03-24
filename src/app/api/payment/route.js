import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(req) {
  try {
    const { amount, orderId } = await req.json();

    const merchantCode = process.env.FONEPAY_MERCHANT_CODE;

    // Fonepay payment string (depends on merchant format)
    const paymentString = `fonepay://pay?merchant=${merchantCode}&amount=${amount}&orderId=${orderId}`;

    // Generate QR as base64 image
    const qrCodeDataURL = await QRCode.toDataURL(paymentString);

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataURL,
      paymentString,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "QR generation failed" },
      { status: 500 }
    );
  }
}