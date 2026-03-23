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
      }, 100);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-[rgba(251,244,236,1)] pt-20">

      {/* 🎬 HERO SECTION */}
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

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 flex flex-col justify-center items-center text-center px-6">

          <h1 className="text-4xl md:text-6xl font-bold text-[rgba(251,244,236,1)] mb-4 leading-tight">
            Delicious Food <br /> Delivered Fast 🍔
          </h1>

          <p className="text-[rgba(251,244,236,0.85)] max-w-xl mb-6">
            Order fresh meals from FoodAllpur and enjoy hot, tasty food at your doorstep with just a few clicks.
          </p>

          <Link
            href="/menu"
            className="bg-[rgba(178,60,47,1)] text-white px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition"
          >
            Order Now
          </Link>

        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="flex flex-col items-center px-6 pt-16 pb-20">

        <h2 className="text-3xl font-bold text-[rgba(178,60,47,1)] mb-10 text-center">
          Why Choose FoodAllpur 🍽️
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">

          {/* Card 1 */}
          <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl hover:scale-105 transition text-center border-t-4 border-[rgba(178,60,47,1)]">
            <h3 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-2">
              🍕 Fast Delivery
            </h3>
            <p className="text-[rgba(69,50,26,1)] text-sm">
              Get your food delivered quickly and fresh at your doorstep.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl hover:scale-105 transition text-center border-t-4 border-[rgba(178,60,47,1)]">
            <h3 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-2">
              🍔 Best Quality
            </h3>
            <p className="text-[rgba(69,50,26,1)] text-sm">
              High-quality, hygienic and freshly prepared meals every time.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl hover:scale-105 transition text-center border-t-4 border-[rgba(178,60,47,1)]">
            <h3 className="text-xl font-semibold text-[rgba(178,60,47,1)] mb-2">
              💳 Easy Payment
            </h3>
            <p className="text-[rgba(69,50,26,1)] text-sm">
              Secure and multiple payment options for smooth checkout.
            </p>
          </div>

        </div>
      </div>

      {/* FOOTER CTA */}
      <div className="bg-[rgba(178,60,47,1)] text-white py-12 text-center">

        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Hungry? Order now and enjoy!
        </h2>

        <Link
          href="/menu"
          className="bg-white text-[rgba(178,60,47,1)] px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
        >
          Browse Menu
        </Link>

      </div>

    </main>
  );
}