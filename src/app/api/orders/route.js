import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, total } = body;

    // ✅ 1. Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart items are required" },
        { status: 400 }
      );
    }

    if (!total || total <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid total amount" },
        { status: 400 }
      );
    }

    // ✅ 2. Recalculate total (SECURITY)
    const calculatedTotal = items.reduce((acc, item) => {
      const price =
        item.type === "half"
          ? item.halfPrice ?? item.price / 2
          : item.fullPrice ?? item.price;

      const qty = item.quantity ?? 1;

      return acc + price * qty;
    }, 0);

    // Prevent tampering
    if (calculatedTotal !== total) {
      return NextResponse.json(
        { success: false, message: "Total mismatch detected" },
        { status: 400 }
      );
    }

    // ✅ 3. Clean items (store only needed fields)
    const cleanItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      price:
        item.type === "half"
          ? item.halfPrice ?? item.price / 2
          : item.fullPrice ?? item.price,
      quantity: item.quantity ?? 1,
    }));

    // ✅ 4. Create order object
    const orderData = {
      items: cleanItems,
      total: calculatedTotal,
      status: "pending",     // pending → paid → completed
      paid: false,
      paymentMethod: "qr",   // future: khalti/esewa
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // ✅ 5. Save to Firestore
    const docRef = await addDoc(collection(db, "orders"), orderData);

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