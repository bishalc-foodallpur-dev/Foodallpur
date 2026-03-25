"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateItemType,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useCart();

  const { user } = useAuth(); // ✅ added

  const safeCart = cart || [];

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const colors = {
    primary: "rgba(178,60,47,1)",
    bg: "rgba(251,244,236,1)",
    dark: "rgba(69,50,26,1)",
  };

  // ✅ Calculate total safely
  useEffect(() => {
    const sum = safeCart.reduce((acc, item) => {
      const price =
        item.type === "half"
          ? item.halfPrice ?? item.price / 2
          : item.fullPrice ?? item.price;

      const qty = item.quantity ?? 1;

      return acc + price * qty;
    }, 0);

    setTotal(sum);
  }, [safeCart]);

  // ✅ Handle Payment
  const handlePayment = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (loading) return;

    try {
      if (safeCart.length === 0) {
        alert("Cart is empty");
        return;
      }

      setLoading(true);

      const order = {
        items: safeCart,
        total,
        userId: user.uid, // ✅ IMPORTANT FIX
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      // ✅ Create Order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order failed");

      const orderId = data.orderId;

      // ✅ Generate QR Payment
      const paymentRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, orderId }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(paymentData.message || "QR generation failed");
      }

      setQrCode(paymentData.qrCode);
      setShowQR(true);

      // ✅ Clear cart
      clearCart();

    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-20 px-3 pb-32"
      style={{ backgroundColor: colors.bg }}
    >
      <h1
        className="text-xl font-bold mb-5 text-center"
        style={{ color: colors.primary }}
      >
        Your Cart 🛒
      </h1>

      {safeCart.length === 0 ? (
        <p className="text-center" style={{ color: colors.dark }}>
          Your cart is empty.
        </p>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">

          {/* ITEMS */}
          {safeCart.map((item) => {
            const price =
              item.type === "half"
                ? item.halfPrice ?? item.price / 2
                : item.fullPrice ?? item.price;

            const qty = item.quantity ?? 1;
            const itemTotal = price * qty;

            return (
              <div
                key={item.id}
                className="p-4 rounded-lg shadow bg-white flex flex-col gap-3"
              >
                {/* INFO */}
                <div>
                  <h2
                    className="font-semibold text-base"
                    style={{ color: colors.dark }}
                  >
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Rs {price} × {qty} = Rs {itemTotal}
                  </p>

                  <p className="text-xs text-gray-400 capitalize">
                    Type: {item.type}
                  </p>
                </div>

                {/* CONTROLS */}
                <div className="flex flex-wrap gap-2 items-center justify-between">

                  {/* QTY */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="px-3 py-2 rounded text-white transition hover:scale-105"
                      style={{ backgroundColor: colors.dark }}
                    >
                      -
                    </button>

                    <span>{qty}</span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="px-3 py-2 rounded text-white transition hover:scale-105"
                      style={{ backgroundColor: colors.dark }}
                    >
                      +
                    </button>
                  </div>

                  {/* TYPE */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateItemType(item.id, "half")}
                      className="px-3 py-1 text-sm rounded border"
                      style={{
                        backgroundColor:
                          item.type === "half"
                            ? colors.primary
                            : "transparent",
                        color:
                          item.type === "half"
                            ? "white"
                            : colors.dark,
                        borderColor: colors.primary,
                      }}
                    >
                      Half
                    </button>

                    <button
                      onClick={() => updateItemType(item.id, "full")}
                      className="px-3 py-1 text-sm rounded border"
                      style={{
                        backgroundColor:
                          item.type === "full"
                            ? colors.primary
                            : "transparent",
                        color:
                          item.type === "full"
                            ? "white"
                            : colors.dark,
                        borderColor: colors.primary,
                      }}
                    >
                      Full
                    </button>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="px-3 py-2 rounded text-white text-sm w-full mt-2 transition hover:scale-105"
                    style={{ backgroundColor: "red" }}
                  >
                    Remove
                  </button>

                </div>
              </div>
            );
          })}

          {/* QR */}
          {showQR && qrCode && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow text-center">
              <h2 className="font-semibold mb-3" style={{ color: colors.dark }}>
                Scan to Pay
              </h2>

              <Image
                src={qrCode}
                alt="QR Code"
                width={200}
                height={200}
                className="mx-auto"
                unoptimized // ✅ important for base64 QR
              />

              <p className="text-xs text-gray-500 mt-3">
                Scan using your payment app
              </p>
            </div>
          )}
        </div>
      )}

      {/* MOBILE FOOTER */}
      {safeCart.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 flex flex-col gap-3 md:hidden">

          <div className="flex justify-between font-semibold" style={{ color: colors.dark }}>
            <span>Total:</span>
            <span>Rs {total}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearCart}
              className="flex-1 py-2 rounded"
              style={{ backgroundColor: "#ccc", color: colors.dark }}
            >
              Clear
            </button>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 py-2 rounded text-white disabled:opacity-50"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP FOOTER */}
      {safeCart.length > 0 && (
        <div className="hidden md:flex max-w-4xl mx-auto mt-6 p-4 bg-white rounded-lg shadow justify-between items-center">
          <div className="font-semibold" style={{ color: colors.dark }}>
            Total: Rs {total}
          </div>

          <div className="flex gap-3">
            <button
              onClick={clearCart}
              className="px-4 py-2 rounded"
              style={{ backgroundColor: "#ccc", color: colors.dark }}
            >
              Clear
            </button>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="px-6 py-2 rounded text-white"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}