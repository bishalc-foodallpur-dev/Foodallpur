import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("ORDER BODY:", body);

    const docRef = await addDoc(collection(db, "orders"), {
      ...body,
      status: "pending",
      paid: false,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      orderId: docRef.id,
    });

  } catch (error) {
    console.error("ORDER API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to save order",
      },
      { status: 500 }
    );
  }
}