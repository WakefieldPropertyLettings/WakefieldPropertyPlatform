"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");

  const [image, setImage] = useState("");
const [imageFile, setImageFile] = useState<File | null>(null);

// Gallery images
const [galleryImages, setGalleryImages] = useState<any[]>([]);
const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetchProperty();
  fetchGalleryImages();
}, []);

  async function fetchProperty() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error) {
      console.error(error);
      alert("Property not found.");
      router.push("/admin");
      return;
    }

    setTitle(data.title);
    setLocation(data.location);
    setPrice(data.price);
    setBedrooms(String(data.bedrooms));
    setBathrooms(String(data.bathrooms));
    setArea(data.area);
    setImage(data.image);
    setFeatured(data.featured);

    setLoading(false);
  }
  async function fetchGalleryImages() {
  const { data, error } = await supabase
    .from("property_images")
    .select("*")
    .eq("property_id", Number(id))
    .order("id");

  if (error) {
    console.error(error);
    return;
  }

  setGalleryImages(data || []);
}
  async function deleteGalleryImage(
  imageId: number,
  imageUrl: string
) {
  if (!confirm("Delete this image?")) return;

  const fileName = imageUrl.split("/").pop();

  if (fileName) {
    await supabase.storage
      .from("property-gallery")
      .remove([fileName]);
  }

  const { error } = await supabase
    .from("property_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    console.error(error);
    alert("Failed to delete image.");
    return;
  }

  fetchGalleryImages();
}

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  let imageUrl = image;

  // Upload main image
  if (imageFile) {
    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("property-gallery")
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error(uploadError);
      alert(uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from("property-gallery")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  // Upload gallery images
  if (galleryFiles.length > 0) {
    for (const file of galleryFiles) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("property-gallery")
        .upload(fileName, file);

      if (uploadError) {
        console.error(uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from("property-gallery")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from("property_images")
        .insert([
          {
            property_id: Number(id),
            image_url: data.publicUrl,
          },
        ]);

      if (insertError) {
        console.error(insertError);
      }
    }

    await fetchGalleryImages();
  }

  const { error } = await supabase
    .from("properties")
    .update({
      title,
      location,
      price,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area,
      image: imageUrl,
      featured,
    })
    .eq("id", Number(id));

  if (error) {
    console.error(error);
    alert("Failed to update property.");
    return;
  }

  alert("Property updated successfully!");

  router.push("/admin");
}

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <section className="bg-[#0B1F3A] py-14 text-white">
        <div className="mx-auto max-w-5xl px-6">

          <h1 className="text-4xl font-bold">
            Edit Property
          </h1>

          <p className="mt-3 text-gray-300">
            Update the property information below.
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
              Current Image
            </label>
            <div className="mt-8">
  <h3 className="mb-4 text-xl font-bold">
    Gallery Images
  </h3>

  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

    {galleryImages.map((photo) => (

  <div
    key={photo.id}
    className="relative"
  >

    <img
      src={photo.image_url}
      alt=""
      className="h-32 w-full rounded-lg border object-cover"
    />

    <button
      type="button"
      onClick={() =>
        deleteGalleryImage(
          photo.id,
          photo.image_url
        )
      }
      className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
    >
      ✕
    </button>

  </div>

))}

  </div>
</div>

            <img
              src={image}
              alt={title}
              className="mb-4 h-64 w-full rounded-xl border object-cover"
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Replace Image
            </label>
            <div className="mt-8">

  <label className="mb-2 block font-semibold">
    Add Gallery Images
  </label>

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => {
      if (e.target.files) {
        setGalleryFiles(Array.from(e.target.files));
      }
    }}
    className="w-full rounded-lg border p-3"
  />

</div>

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
            className="rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-[#0B1F3A] hover:opacity-90"
          >
            Update Property
          </button>

        </form>

      </section>

    </main>
  );
}