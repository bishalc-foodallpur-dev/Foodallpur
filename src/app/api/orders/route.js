import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();

    const docRef = await addDoc(collection(db, "orders"), {
      ...body,
      createdAt: serverTimestamp(),
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      orderId: docRef.id,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to save order" },
      { status: 500 }
    );
  }
}