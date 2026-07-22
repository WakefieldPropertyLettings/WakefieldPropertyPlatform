"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddPropertyPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");

  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [featured, setFeatured] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    let imageUrl = "";

    // Upload image to Supabase Storage
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Image upload failed.");
        console.error(uploadError);
        return;
      }

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    // Save property into database
    const { error } = await supabase
      .from("properties")
      .insert([
        {
          title,
          location,
          price,
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          area,
          image: imageUrl,
          featured,
        },
      ]);

    if (error) {
      alert("Error saving property.");
      console.error(error);
      return;
    }

    alert("Property added successfully!");

    // Reset form
    setTitle("");
    setLocation("");
    setPrice("");
    setBedrooms("");
    setBathrooms("");
    setArea("");
    setImage("");
    setImageFile(null);
    setFeatured(false);

  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
}
  return (
    <main className="min-h-screen bg-gray-100">

      <section className="bg-[#0B1F3A] py-14 text-white">
        <div className="mx-auto max-w-5xl px-6">

          <h1 className="text-4xl font-bold">
            THIS IS THE NEW PAGE
          </h1>

          <p className="mt-3 text-gray-300">
            Complete the information below to publish a new property.
          </p>

        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl bg-white p-8 shadow"
        >

          <div>
            <label className="mb-2 block font-semibold">
              Property Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-semibold">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Monthly Rent
              </label>

              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div>
              <label className="mb-2 block font-semibold">
                Bedrooms
              </label>

              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Bathrooms
              </label>

              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Area
              </label>

              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Property Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />

            <label>
              Featured Property
            </label>

          </div>

          <button
            type="submit"
            className="rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-[#0B1F3A]"
          >
            Save Property
          </button>

        </form>

      </section>

    </main>
  );
}