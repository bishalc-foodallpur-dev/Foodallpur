"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  const [currentVideo, setCurrentVideo] = useState(0);
  const [fade, setFade] = useState(true);

  const getRandomIndex = (current) => {
    let next;
    do {
      next = Math.floor(Math.random() * videos.length);
    } while (next === current);
    return next;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentVideo((prev) => getRandomIndex(prev));
        setFade(true);
      }, 100); // KEEP AS YOU WANTED
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-[rgba(251,244,236,1)] pt-20">

      {/* 🎬 Video Hero Section */}
      <div className="relative w-full h-[75vh] overflow-hidden">

        <video
          key={currentVideo}
          src={videos[currentVideo]}
          autoPlay
          muted
          loop
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Overlay text only */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 flex flex-col justify-center items-center text-center px-6">

          <h1 className="text-4xl md:text-6xl font-bold text-[rgba(251,244,236,1)] mb-4">
            Delicious Food, Delivered Fast 🍔
          </h1>

          <p className="text-[rgba(251,244,236,0.9)] max-w-xl">
            Order fresh meals from FoodAllpur and enjoy hot, delicious food at your doorstep.
          </p>

        </div>
      </div>

      {/* ✅ CTA Button BELOW video */}
      <div className="flex justify-center mt-10">
        <Link
          href="/menu"
          className="bg-[rgba(178,60,47,1)] text-white px-8 py-3 rounded-lg shadow-md hover:scale-105 transition"
        >
          Order Now
        </Link>
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-center px-6 pt-16 pb-20">

        <div className="mt-10 grid md:grid-cols-3 gap-8 max-w-6xl w-full">

          <div className="p-6 rounded-xl bg-white shadow hover:shadow-lg hover:scale-105 transition text-center">
            <h3 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-2">
              🍕 Fast Delivery
            </h3>
            <p className="text-[rgba(69,50,26,1)] text-sm">
              Get your food delivered quickly and fresh.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white shadow hover:shadow-lg hover:scale-105 transition text-center">
            <h3 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-2">
              🍔 Best Quality
            </h3>
            <p className="text-[rgba(69,50,26,1)] text-sm">
              High-quality and hygienic meals every time.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white shadow hover:shadow-lg hover:scale-105 transition text-center">
            <h3 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-2">
              💳 Easy Payment
            </h3>
            <p className="text-[rgba(69,50,26,1)] text-sm">
              Multiple secure payment options available.
            </p>
          </div>

        </div>
      </div>

    </main>
  );
}