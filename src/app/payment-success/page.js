"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function PaymentSuccess() {
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();

    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>
        <p>Redirecting to home...</p>
      </div>
    </div>
  );
}