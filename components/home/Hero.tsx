"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=2000",
    title: "Find Your Perfect Home",
    subtitle:
      "Professional Property Lettings and Management across Wakefield.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=2000",
    title: "Rooms, Flats & Houses",
    subtitle:
      "Quality accommodation with professional property management.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=2000",
    title: "Move With Confidence",
    subtitle:
      "Helping tenants and landlords across Wakefield every day.",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            current === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      ))}

      <div className="relative z-10 flex h-full items-center justify-center">

        <div className="px-6 text-center text-white">

          <h1 className="text-5xl font-extrabold md:text-7xl">
            {slides[current].title}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-200">
            {slides[current].subtitle}
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <button className="rounded-xl bg-[#D4AF37] px-8 py-4 text-lg font-bold text-[#0B1F3A] transition hover:scale-105">
              View Properties
            </button>

            <button className="rounded-xl border-2 border-white px-8 py-4 text-lg font-bold transition hover:bg-white hover:text-[#0B1F3A]">
              Book Viewing
            </button>

          </div>

        </div>

      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">

        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 w-3 rounded-full ${
              current === index ? "bg-[#D4AF37]" : "bg-white/60"
            }`}
          />
        ))}

      </div>

    </section>
  );
}