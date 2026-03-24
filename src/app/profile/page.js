"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";
import { useCart } from "@/context/CartContext";

export default function Profile() {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
    photoURL: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Theme colors
  const colors = {
    primary: "rgba(178, 60, 47, 1)",
    bg: "rgba(251, 244, 236, 1)",
    card: "rgba(69, 50, 26, 1)",
    text: "rgba(251,244,236,1)",
  };

  const statusSteps = ["Pending", "Cooking", "Out for delivery", "Delivered"];

  // Fetch profile & orders
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
        setPreview(data.photoURL);
      }
      setLoading(false);
    };

    fetchProfile();

    const q = query(collection(db, "orders"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      ordersData.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );
      setOrders(ordersData);
      setOrdersLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Upload image to Cloudinary
  const uploadToCloudinary = async () => {
    if (!image) return profile.photoURL;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "foodallpur");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dawgv2iso/image/upload",
      formData
    );
    return res.data.secure_url;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    const imageUrl = await uploadToCloudinary();
    await setDoc(doc(db, "users", user.uid), {
      ...profile,
      photoURL: imageUrl,
      email: user.email,
    });
    setMessage("✅ Profile updated!");
    setSaving(false);
  };

  const handleReorder = (items) => {
    items.forEach((item) => addToCart(item));
    alert("🛒 Added to cart!");
  };

  const handleCancel = async (orderId, status) => {
    if (status !== "Pending") {
      alert("❌ Cannot cancel after processing");
      return;
    }
    await updateDoc(doc(db, "orders", orderId), { status: "Cancelled" });
    alert("❌ Order cancelled");
  };

  // Order progress bar
  const renderTracking = (status) => {
    const currentStep = statusSteps.indexOf(status);
    return (
      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1" style={{ color: colors.text }}>
          {statusSteps.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {statusSteps.map((step, i) => (
            <div key={i} className="flex-1 flex items-center">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: i <= currentStep ? colors.primary : "#888" }}
              />
              {i !== statusSteps.length - 1 && (
                <div
                  className="flex-1 h-1"
                  style={{ backgroundColor: i < currentStep ? colors.primary : "#888" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <ProtectedRoute>
      <main className="min-h-screen flex justify-center px-6 py-10" style={{ backgroundColor: colors.bg }}>
        <div className="w-full max-w-3xl p-6 rounded-xl shadow-lg space-y-8" style={{ backgroundColor: colors.card }}>
          {/* Profile */}
          <h1 className="text-2xl font-bold text-center" style={{ color: colors.text }}>
            My Profile 👤
          </h1>

          {message && <p className="text-center">{message}</p>}

          <div className="flex flex-col items-center">
            <img
              src={preview || "https://via.placeholder.com/100"}
              className="w-24 h-24 rounded-full object-cover"
            />
            <input type="file" onChange={handleImageChange} className="text-white mt-2"/>
          </div>

          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Name"
            className="w-full p-3 rounded"
          />
          <input
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="Phone"
            className="w-full p-3 rounded"
          />
          <textarea
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            placeholder="Address"
            className="w-full p-3 rounded"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded text-white"
              style={{ backgroundColor: colors.primary }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 rounded border text-white"
            >
              Logout
            </button>
          </div>

          {/* Orders */}
          <h2 className="text-xl font-bold" style={{ color: colors.text }}>🧾 My Orders</h2>
          {ordersLoading ? (
            <p style={{ color: colors.text }}>Loading...</p>
          ) : orders.length === 0 ? (
            <p style={{ color: colors.text }}>No orders yet</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-4 rounded border mb-4" style={{ borderColor: colors.primary }}>
                <div className="flex justify-between mb-2">
                  <span style={{ color: colors.text }}>#{order.id.slice(0, 6)}</span>
                  <span style={{ color: colors.text }}>{order.status}</span>
                </div>

                {order.items?.map((item, i) => (
                  <p key={i} style={{ color: colors.text }}>
                    {item.name} × {item.quantity}
                  </p>
                ))}

                <p style={{ color: colors.text }} className="font-semibold">Rs. {order.total}</p>

                {renderTracking(order.status)}

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleReorder(order.items)}
                    className="px-3 py-2 rounded text-sm text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    🔁 Reorder
                  </button>
                  <button
                    onClick={() => handleCancel(order.id, order.status)}
                    className="px-3 py-2 rounded text-sm text-white"
                    style={{ backgroundColor: "#444" }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}