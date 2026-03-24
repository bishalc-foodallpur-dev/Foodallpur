"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Review Form
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
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-4">
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
        className="w-full bg-[#B23C2F] text-white py-2 rounded-lg hover:opacity-90"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default function Home() {
  const videos = [
    "/videos/food1.mp4",
    "/videos/food2.mp4",
    "/videos/food3.mp4",
    "/videos/food4.mp4",
    "/videos/food5.mp4",
    "/videos/food6.mp4",
    "/videos/food7.mp4",
  ];

  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState([0,0,0,0,0]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [fade, setFade] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const colors = {
    primary: "#B23C2F",
    bg: "#FFF7F2",
    card: "#FFFFFF",
    text: "#3A2A1A",
    accent: "#FFB703",
  };

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Categories
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "foods"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const uniqueCategories = [...new Set(data.map((f) => f.category).filter(Boolean))];
      setCategories(uniqueCategories);
      setLoadingCategories(false);
    });
    return () => unsubscribe();
  }, []);

  // Reviews + stats
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(data);

      // Average
      const total = data.reduce((sum, r) => sum + (r.rating || 0), 0);
      setAvgRating(data.length ? (total / data.length).toFixed(1) : 0);

      // Breakdown
      const breakdown = [0,0,0,0,0];
      data.forEach(r => {
        if (r.rating >=1 && r.rating <=5) breakdown[r.rating-1]++;
      });
      setRatingBreakdown(breakdown);
    });
    return () => unsubscribe();
  }, []);

  // Video rotation
  const getRandomIndex = useCallback((current) => {
    let next;
    do {
      next = Math.floor(Math.random() * videos.length);
    } while (next === current);
    return next;
  }, [videos.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentVideo((prev) => getRandomIndex(prev));
        setFade(true);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, [getRandomIndex]);

  return (
    <main style={{ backgroundColor: colors.bg }}>

      {/* HERO */}
      <section className="relative h-[60vh] md:h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <video
          key={currentVideo}
          src={videos[currentVideo]}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"}`}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 px-4 max-w-xl text-white">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
            Delicious Food Delivered Fast
          </h1>
          <p className="text-sm md:text-lg mb-6 opacity-90">
            Fresh meals delivered hot and fast to your doorstep.
          </p>
          <Link href="/menu" className="bg-[#B23C2F] px-6 py-3 rounded-lg font-medium hover:scale-105 transition inline-block">
            Order Now
          </Link>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="px-4 py-14">

        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: colors.primary }}>
          Customer Reviews ⭐
        </h2>

        {/* Average */}
        <div className="text-center mb-6">
          <p className="text-lg font-semibold">Average Rating: ⭐ {avgRating}</p>
        </div>

        {/* Breakdown */}
        <div className="max-w-md mx-auto mb-10">
          {[5,4,3,2,1].map((star, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span>{star}⭐</span>
              <div className="flex-1 bg-gray-200 h-2 rounded">
                <div
                  className="h-2 rounded"
                  style={{ width: `${reviews.length ? (ratingBreakdown[star-1]/reviews.length)*100 : 0}%`, backgroundColor: colors.primary }}
                />
              </div>
              <span>{ratingBreakdown[star-1]}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <ReviewForm user={user} />

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-5 rounded-2xl shadow">
              <h3 className="font-semibold" style={{ color: colors.text }}>
                {rev.name || "Anonymous"}
              </h3>
              <div className="text-yellow-500">
                {"★".repeat(rev.rating || 0)}
                <span className="text-gray-300">
                  {"★".repeat(5 - (rev.rating || 0))}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
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
