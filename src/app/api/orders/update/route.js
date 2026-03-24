import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { orderId, status, paid } = await req.json();

    const orderRef = doc(db, "orders", orderId);

    await updateDoc(orderRef, {
      status,
      paid,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}