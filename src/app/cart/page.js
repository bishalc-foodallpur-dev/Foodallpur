"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateItemType,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useCart();

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const colors = {
    primary: "rgba(178,60,47,1)",
    bg: "rgba(251,244,236,1)",
    dark: "rgba(69,50,26,1)",
  };

  // ✅ Calculate total
  useEffect(() => {
    let sum = 0;

    cart.forEach((item) => {
      const price =
        item.type === "half"
          ? item.halfPrice || item.price / 2
          : item.fullPrice || item.price;

      const qty = item.quantity || 1;

      sum += price * qty;
    });

    setTotal(sum);
  }, [cart]);

  // ✅ Payment handler
  const handlePayment = async () => {
    try {
      if (cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      setLoading(true);

      const order = {
        items: cart,
        total,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Order failed");

      const orderId = data.orderId;

      const paymentRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          orderId,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(paymentData.message || "QR generation failed");
      }

      setQrCode(paymentData.qrCode);
      setShowQR(true);

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-24 px-6"
      style={{ backgroundColor: colors.bg }}
    >
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: colors.primary }}
      >
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <p style={{ color: colors.dark }}>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">

          {/* CART ITEMS */}
          {cart.map((item) => {
            const price =
              item.type === "half"
                ? item.halfPrice || item.price / 2
                : item.fullPrice || item.price;

            const qty = item.quantity || 1;
            const itemTotal = price * qty;

            return (
              <div
                key={item.id}
                className="p-4 rounded-lg shadow flex flex-col md:flex-row justify-between md:items-center"
                style={{ backgroundColor: "white" }}
              >
                {/* INFO */}
                <div>
                  <h2
                    className="font-semibold"
                    style={{ color: colors.dark }}
                  >
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Price: Rs {price} × {qty} = Rs {itemTotal}
                  </p>

                  <p className="text-xs mt-1 text-gray-400 capitalize">
                    Type: {item.type}
                  </p>
                </div>

                {/* CONTROLS */}
                <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-0 md:items-center">

                  {/* QUANTITY */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="px-3 py-1 rounded text-white"
                      style={{ backgroundColor: colors.dark }}
                    >
                      -
                    </button>

                    <span style={{ color: colors.dark }}>
                      {qty}
                    </span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="px-3 py-1 rounded text-white"
                      style={{ backgroundColor: colors.dark }}
                    >
                      +
                    </button>
                  </div>

                  {/* HALF / FULL */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateItemType(item.id, "half")}
                      className="px-3 py-1 rounded text-sm border"
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
                      className="px-3 py-1 rounded text-sm border"
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
                    className="px-3 py-1 rounded text-white text-sm"
                    style={{ backgroundColor: "red" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* TOTAL + ACTIONS */}
          <div
            className="mt-6 p-4 rounded-lg shadow flex flex-col md:flex-row justify-between md:items-center gap-4"
            style={{ backgroundColor: "white" }}
          >
            <h2
              className="text-lg font-semibold"
              style={{ color: colors.dark }}
            >
              Total: Rs {total}
            </h2>

            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: "#ccc",
                  color: colors.dark,
                }}
              >
                Clear Cart
              </button>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="px-6 py-2 rounded-lg text-white disabled:opacity-50"
                style={{ backgroundColor: colors.primary }}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>

          {/* QR CODE */}
          {showQR && qrCode && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow text-center">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: colors.dark }}
              >
                Scan to Pay
              </h2>

              <img
                src={qrCode}
                alt="QR Code"
                className="mx-auto w-64 h-64"
              />

              <p className="mt-4 text-sm text-gray-500">
                Open your payment app and scan this QR
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}