"use client";

import { useEffect, useState } from "react";

type GalleryProps = {
  images: string[];
};

export default function PropertyGallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setSelectedImage(images[0]);
  }, [images]);

  function previousImage() {
    const current = images.indexOf(selectedImage);
    const previous = current === 0 ? images.length - 1 : current - 1;
    setSelectedImage(images[previous]);
  }

  function nextImage() {
    const current = images.indexOf(selectedImage);
    const next = current === images.length - 1 ? 0 : current + 1;
    setSelectedImage(images[next]);
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!fullscreen) return;

      if (e.key === "Escape") {
        setFullscreen(false);
      }

      if (e.key === "ArrowLeft") {
        previousImage();
      }

      if (e.key === "ArrowRight") {
        nextImage();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreen, selectedImage]);

  return (
    <>
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg">

        <img
          src={selectedImage}
          alt=""
          onClick={() => setFullscreen(true)}
          className="h-[550px] w-full cursor-pointer object-cover transition duration-300 hover:scale-105"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-2xl shadow-lg hover:bg-white"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-2 text-2xl shadow-lg hover:bg-white"
            >
              ›
            </button>
          </>
        )}

      </div>

      {/* Thumbnails */}

      <div className="mt-6 flex gap-4 overflow-x-auto pb-2">

        {images.map((img) => (

          <img
            key={img}
            src={img}
            alt=""
            onClick={() => setSelectedImage(img)}
            className={`h-24 w-36 cursor-pointer rounded-xl border-4 object-cover transition hover:scale-105 ${
              selectedImage === img
                ? "border-[#D4AF37]"
                : "border-transparent"
            }`}
          />

        ))}

      </div>

      {/* Full Screen */}

      {fullscreen && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
        >

          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute right-6 top-6 text-5xl text-white"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={previousImage}
                className="absolute left-8 text-6xl text-white"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={nextImage}
                className="absolute right-8 text-6xl text-white"
              >
                ›
              </button>
            </>
          )}

          <img
            src={selectedImage}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
          />

        </div>

      )}

    </>
  );
}