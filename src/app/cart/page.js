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

  // ✅ Calculate total
  useEffect(() => {
    let sum = 0;

    cart.forEach((item) => {
      const price =
        item.type === "half"
          ? item.halfPrice || item.price / 2
          : item.fullPrice || item.price;

      sum += price * item.quantity;
    });

    setTotal(sum);
  }, [cart]);

  // ✅ Payment handler (QR)
  const handlePayment = async () => {
    try {
      if (cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      setLoading(true);

      // 1. Create order
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

      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      const orderId = data.orderId;

      // 2. Generate QR
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
    <div className="min-h-screen bg-[rgba(251,244,236,1)] pt-24 px-6">
      <h1 className="text-2xl font-bold text-[rgba(178,60,47,1)] mb-6">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-[rgba(69,50,26,1)]">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">

          {cart.map((item) => {
            const price =
              item.type === "half"
                ? item.halfPrice || item.price / 2
                : item.fullPrice || item.price;

            return (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between md:items-center"
              >
                {/* Info */}
                <div>
                  <h2 className="font-semibold text-[rgba(69,50,26,1)]">
                    {item.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Price: Rs {price}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-0 md:items-center">

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* Half / Full */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateItemType(item.id, "half")}
                      className="px-3 py-1 rounded border text-sm"
                      style={{
                        backgroundColor:
                          item.type === "half"
                            ? "rgba(178,60,47,1)"
                            : "rgba(251,244,236,1)",
                        color:
                          item.type === "half"
                            ? "white"
                            : "rgba(69,50,26,1)",
                        borderColor: "rgba(178,60,47,1)",
                      }}
                    >
                      Half
                    </button>

                    <button
                      onClick={() => updateItemType(item.id, "full")}
                      className="px-3 py-1 rounded border text-sm"
                      style={{
                        backgroundColor:
                          item.type === "full"
                            ? "rgba(178,60,47,1)"
                            : "rgba(251,244,236,1)",
                        color:
                          item.type === "full"
                            ? "white"
                            : "rgba(69,50,26,1)",
                        borderColor: "rgba(178,60,47,1)",
                      }}
                    >
                      Full
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="px-3 py-1 rounded bg-red-500 text-white text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* Total + Payment */}
          <div className="mt-6 p-4 bg-white rounded-lg shadow flex flex-col md:flex-row justify-between md:items-center gap-4">
            
            <h2 className="text-lg font-semibold text-[rgba(69,50,26,1)]">
              Total: Rs {total}
            </h2>

            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Clear Cart
              </button>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="bg-[rgba(178,60,47,1)] text-white px-6 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>

          {/* QR Section */}
          {showQR && qrCode && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow text-center">
              <h2 className="text-lg font-semibold mb-4">
                Scan to Pay with Fonepay
              </h2>

              <img
                src={qrCode}
                alt="Fonepay QR"
                className="mx-auto w-64 h-64"
              />

              <p className="mt-4 text-sm text-gray-500">
                Open your Fonepay app and scan this QR
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}