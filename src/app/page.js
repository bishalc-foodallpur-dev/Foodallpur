"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// 3D LOGO (NO SSR)
const Logo3D = dynamic(() => import("@/components/Logo3D"), {
  ssr: false,
});

// Review Form (UNCHANGED)
function ReviewForm({ user }) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to submit a review.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "reviews"), {
        name: name || user.email,
        comment,
        rating,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setName("");
      setComment("");
      setRating(5);
      alert("Review submitted!");
    } catch (err) {
      console.error(err);
      alert("Error submitting review");
    }

    setLoading(false);
  };

  return (
    <form className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-center">Leave a Review</h2>

      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Your Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      {/* Rating */}
      <div className="flex gap-2 justify-center text-2xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#B23C2F] text-white py-2 rounded-lg"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState([0, 0, 0, 0, 0]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const colors = {
    primary: "#B23C2F",
    bg: "#FFF7F2",
    text: "#3A2A1A",
  };

  // Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Categories
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "foods"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      const unique = [...new Set(data.map((f) => f.category).filter(Boolean))];
      setCategories(unique);
      setLoadingCategories(false);
    });

    return () => unsub();
  }, []);

  // Reviews
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(data);

      const total = data.reduce((sum, r) => sum + (r.rating || 0), 0);
      setAvgRating(data.length ? (total / data.length).toFixed(1) : 0);

      const breakdown = [0, 0, 0, 0, 0];
      data.forEach((r) => {
        if (r.rating >= 1 && r.rating <= 5) breakdown[r.rating - 1]++;
      });
      setRatingBreakdown(breakdown);
    });

    return () => unsub();
  }, []);

  return (
    <main style={{ backgroundColor: colors.bg }}>

      {/* ================= HERO (3D LOGO) ================= */}
      <section className="relative h-[70vh] md:h-[90vh] flex items-center justify-center text-center overflow-hidden">

        {/* 3D LOGO BACKGROUND */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <div className="w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]">
            <Logo3D />
          </div>
        </div>

        {/* TEXT */}
        <div className="relative z-10 px-4 max-w-xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#3A2A1A]">
            Delicious Food Delivered Fast
          </h1>

          <p className="text-sm md:text-lg mb-6 text-gray-600">
            Fresh meals delivered hot and fast to your doorstep.
          </p>

          <Link
            href="/menu"
            className="bg-[#B23C2F] text-white px-6 py-3 rounded-lg font-medium hover:scale-105 transition inline-block"
          >
            Order Now
          </Link>
        </div>

      </section>

      {/* ================= REVIEWS (UNCHANGED) ================= */}
      <section className="px-4 py-14">

        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: colors.primary }}>
          Customer Reviews ⭐
        </h2>

        <div className="text-center mb-6">
          <p className="text-lg font-semibold">
            Average Rating: ⭐ {avgRating}
          </p>
        </div>

        {/* Breakdown */}
        <div className="max-w-md mx-auto mb-10">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span>{star}⭐</span>
              <div className="flex-1 bg-gray-200 h-2 rounded">
                <div
                  className="h-2 rounded"
                  style={{
                    width: `${reviews.length ? (ratingBreakdown[star - 1] / reviews.length) * 100 : 0}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </div>
              <span>{ratingBreakdown[star - 1]}</span>
            </div>
          ))}
        </div>

        <ReviewForm user={user} />

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-5 rounded-2xl shadow">
              <h3 className="font-semibold text-[#3A2A1A]">
                {rev.name || "Anonymous"}
              </h3>

              <div className="text-yellow-500">
                {"★".repeat(rev.rating || 0)}
                <span className="text-gray-300">
                  {"★".repeat(5 - (rev.rating || 0))}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="px-4 py-12 md:py-16">

        <h2 className="text-xl md:text-3xl font-bold text-center mb-10" style={{ color: colors.primary }}>
          Categories 📂
        </h2>

        {loadingCategories ? (
          <p className="text-center text-gray-500">Loading categories...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={`/menu?category=${encodeURIComponent(cat)}`}
                className="bg-white rounded-2xl shadow p-4 text-center hover:scale-105 transition"
              >
                <div className="font-semibold capitalize" style={{ color: colors.text }}>
                  {cat}
                </div>
              </Link>
            ))}
          </div>
        )}

      </section>

    </main>
  );
}