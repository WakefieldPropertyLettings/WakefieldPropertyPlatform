"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type CreatedProperty = {
  id: number;
};

const MAX_IMAGES = 20;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function AddPropertyPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [googleMap, setGoogleMap] = useState("");

  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [propertyType, setPropertyType] = useState("House");

  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");

  const [parking, setParking] = useState(false);
  const [garden, setGarden] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [billsIncluded, setBillsIncluded] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [featured, setFeatured] = useState(false);

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [selectedImages]);

  function sanitiseFileName(fileName: string) {
    const extension = fileName.includes(".")
      ? fileName.split(".").pop()?.toLowerCase()
      : "jpg";

    const baseName = fileName
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);

    return `${baseName || "property-image"}.${extension || "jpg"}`;
  }

  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setErrorMessage("");

    const remainingSpaces = MAX_IMAGES - selectedImages.length;

    if (remainingSpaces <= 0) {
      setErrorMessage(`You can upload a maximum of ${MAX_IMAGES} images.`);
      event.target.value = "";
      return;
    }

    const acceptedFiles: File[] = [];

    for (const file of files.slice(0, remainingSpaces)) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage(`${file.name} is not a supported image file.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(
          `${file.name} is larger than 10 MB. Please use a smaller image.`
        );
        continue;
      }

      const isDuplicate = selectedImages.some(
        (image) =>
          image.file.name === file.name &&
          image.file.size === file.size &&
          image.file.lastModified === file.lastModified
      );

      if (!isDuplicate) {
        acceptedFiles.push(file);
      }
    }

    const newImages: SelectedImage[] = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedImages((current) => [...current, ...newImages]);
    event.target.value = "";
  }

  function removeSelectedImage(imageId: string) {
    setSelectedImages((current) => {
      const imageToRemove = current.find((image) => image.id === imageId);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return current.filter((image) => image.id !== imageId);
    });
  }

  function moveImage(imageId: string, direction: "left" | "right") {
    setSelectedImages((current) => {
      const currentIndex = current.findIndex((image) => image.id === imageId);

      if (currentIndex === -1) {
        return current;
      }

      const targetIndex =
        direction === "left" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const updated = [...current];
      const [movedImage] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, movedImage);

      return updated;
    });
  }

  function resetForm() {
    selectedImages.forEach((image) => {
      URL.revokeObjectURL(image.previewUrl);
    });

    setTitle("");
    setDescription("");

    setLocation("");
    setAddress("");
    setPostcode("");
    setGoogleMap("");

    setPrice("");
    setDeposit("");
    setAvailableFrom("");
    setPropertyType("House");

    setBedrooms("");
    setBathrooms("");
    setArea("");

    setParking(false);
    setGarden(false);
    setFurnished(false);
    setBillsIncluded(false);
    setPetFriendly(false);
    setFeatured(false);

    setSelectedImages([]);
    setUploadProgress("");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setErrorMessage("");
    setUploadProgress("");

    if (!title.trim()) {
      setErrorMessage("Please enter a property title.");
      return;
    }

    if (!location.trim() && !postcode.trim()) {
      setErrorMessage("Please enter a location or postcode.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setErrorMessage("Please enter a valid monthly rent.");
      return;
    }

    if (selectedImages.length === 0) {
      setErrorMessage("Please select at least one property image.");
      return;
    }

    setSubmitting(true);

    let createdPropertyId: number | null = null;
    const uploadedPaths: string[] = [];

    try {
      setUploadProgress("Creating property record...");

      const { data: createdProperty, error: propertyError } = await supabase
        .from("properties")
        .insert({
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          address: address.trim(),
          postcode: postcode.trim().toUpperCase(),
          google_map: googleMap.trim(),

          price: Number(price),
          deposit: deposit.trim(),
          available_from: availableFrom || null,
          property_type: propertyType,

          bedrooms: bedrooms ? Number(bedrooms) : 0,
          bathrooms: bathrooms ? Number(bathrooms) : 0,
          area: area.trim(),

          parking,
          garden,
          furnished,
          bills_included: billsIncluded,
          pet_friendly: petFriendly,

          image: "",
          featured,
        })
        .select("id")
        .single();

      if (propertyError) {
        throw new Error(propertyError.message);
      }

      createdPropertyId = (createdProperty as CreatedProperty).id;

      const uploadedImages: {
        property_id: number;
        image_url: string;
        sort_order: number;
      }[] = [];

      for (let index = 0; index < selectedImages.length; index += 1) {
        const selectedImage = selectedImages[index];

        setUploadProgress(
          `Uploading image ${index + 1} of ${selectedImages.length}...`
        );

        const safeFileName = sanitiseFileName(selectedImage.file.name);

        const storagePath = `${createdPropertyId}/${Date.now()}-${index}-${crypto.randomUUID()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(storagePath, selectedImage.file, {
            cacheControl: "3600",
            upsert: false,
            contentType: selectedImage.file.type,
          });

        if (uploadError) {
          throw new Error(
            `Failed to upload ${selectedImage.file.name}: ${uploadError.message}`
          );
        }

        uploadedPaths.push(storagePath);

        const { data: publicUrlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(storagePath);

        uploadedImages.push({
          property_id: createdPropertyId,
          image_url: publicUrlData.publicUrl,
          sort_order: index,
        });
      }

      setUploadProgress("Saving image gallery...");

      const { error: galleryError } = await supabase
        .from("property_images")
        .insert(uploadedImages);

      if (galleryError) {
        throw new Error(galleryError.message);
      }

      const coverImageUrl = uploadedImages[0]?.image_url ?? "";

      const { error: coverError } = await supabase
        .from("properties")
        .update({
          image: coverImageUrl,
        })
        .eq("id", createdPropertyId);

      if (coverError) {
        throw new Error(coverError.message);
      }

      setUploadProgress("Property published successfully.");

      window.alert("Property added successfully.");

      resetForm();
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Add property error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The property could not be saved."
      );

      if (uploadedPaths.length > 0) {
        await supabase.storage
          .from("property-images")
          .remove(uploadedPaths);
      }

      if (createdPropertyId !== null) {
        await supabase
          .from("properties")
          .delete()
          .eq("id", createdPropertyId);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-[#0B1F3A] py-14 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
            Admin dashboard
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Add a New Property
          </h1>

          <p className="mt-3 text-gray-300">
            Complete the information below and upload the property photographs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl bg-white p-8 shadow"
        >
          {errorMessage && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <div>
            <label
              htmlFor="property-title"
              className="mb-2 block font-semibold"
            >
              Property Title
            </label>

            <input
              id="property-title"
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Modern double room to rent in Wakefield"
            />
          </div>

          <div>
            <label
              htmlFor="property-description"
              className="mb-2 block font-semibold"
            >
              Property Description
            </label>

            <textarea
              id="property-description"
              rows={7}
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Describe the property, nearby amenities, transport links and key features..."
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="location"
                className="mb-2 block font-semibold"
              >
                Public Location
              </label>

              <input
                id="location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded-lg border p-3"
                placeholder="Central Wakefield"
              />
            </div>

            <div>
              <label
                htmlFor="postcode"
                className="mb-2 block font-semibold"
              >
                Postcode
              </label>

              <input
                id="postcode"
                type="text"
                value={postcode}
                onChange={(event) => setPostcode(event.target.value)}
                className="w-full rounded-lg border p-3 uppercase"
                placeholder="WF1 2AB"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-2 block font-semibold"
            >
              Property Address
            </label>

            <input
              id="address"
              type="text"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="High Street, Wakefield"
            />

            <p className="mt-2 text-xs text-gray-500">
              Avoid publishing the house number if the exact address should
              remain private.
            </p>
          </div>

          <div>
            <label
              htmlFor="google-map"
              className="mb-2 block font-semibold"
            >
              Google Maps Embed URL
            </label>

            <input
              id="google-map"
              type="url"
              value={googleMap}
              onChange={(event) => setGoogleMap(event.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block font-semibold"
              >
                Monthly Rent
              </label>

              <input
                id="price"
                type="number"
                min="0"
                step="1"
                required
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full rounded-lg border p-3"
                placeholder="750"
              />
            </div>

            <div>
              <label
                htmlFor="deposit"
                className="mb-2 block font-semibold"
              >
                Deposit
              </label>

              <input
                id="deposit"
                type="text"
                value={deposit}
                onChange={(event) => setDeposit(event.target.value)}
                className="w-full rounded-lg border p-3"
                placeholder="200"
              />
            </div>

            <div>
              <label
                htmlFor="available-from"
                className="mb-2 block font-semibold"
              >
                Available From
              </label>

              <input
                id="available-from"
                type="date"
                value={availableFrom}
                onChange={(event) => setAvailableFrom(event.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <label
                htmlFor="property-type"
                className="mb-2 block font-semibold"
              >
                Property Type
              </label>

              <select
                id="property-type"
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                className="w-full rounded-lg border p-3"
              >
                <option value="House">House</option>
                <option value="Flat">Flat</option>
                <option value="Apartment">Apartment</option>
                <option value="Studio">Studio</option>
                <option value="Room">Room</option>
                <option value="Bungalow">Bungalow</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="bedrooms"
                className="mb-2 block font-semibold"
              >
                Bedrooms
              </label>

              <input
                id="bedrooms"
                type="number"
                min="0"
                value={bedrooms}
                onChange={(event) => setBedrooms(event.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label
                htmlFor="bathrooms"
                className="mb-2 block font-semibold"
              >
                Bathrooms
              </label>

              <input
                id="bathrooms"
                type="number"
                min="0"
                value={bathrooms}
                onChange={(event) => setBathrooms(event.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label
                htmlFor="area"
                className="mb-2 block font-semibold"
              >
                Area
              </label>

              <input
                id="area"
                type="text"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                className="w-full rounded-lg border p-3"
                placeholder="Central Wakefield"
              />
            </div>
          </div>

          <section className="border-t pt-8">
            <h2 className="mb-6 text-2xl font-bold text-[#0B1F3A]">
              Property Features
            </h2>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={parking}
                  onChange={(event) => setParking(event.target.checked)}
                />
                Parking
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={garden}
                  onChange={(event) => setGarden(event.target.checked)}
                />
                Garden
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={furnished}
                  onChange={(event) => setFurnished(event.target.checked)}
                />
                Furnished
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={billsIncluded}
                  onChange={(event) =>
                    setBillsIncluded(event.target.checked)
                  }
                />
                Bills Included
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={petFriendly}
                  onChange={(event) => setPetFriendly(event.target.checked)}
                />
                Pet Friendly
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) => setFeatured(event.target.checked)}
                />
                Featured Property
              </label>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#0B1F3A]">
                  Property Images
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Select up to {MAX_IMAGES} images. The first image will be the
                  main cover image.
                </p>
              </div>

              <p className="text-sm font-semibold text-[#0B1F3A]">
                {selectedImages.length}/{MAX_IMAGES} selected
              </p>
            </div>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-[#D4AF37] hover:bg-amber-50">
              <span className="text-lg font-bold text-[#0B1F3A]">
                Choose Multiple Images
              </span>

              <span className="mt-2 text-sm text-gray-500">
                JPG, PNG or WebP. Maximum 10 MB per image.
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageSelection}
                disabled={
                  submitting || selectedImages.length >= MAX_IMAGES
                }
                className="sr-only"
              />
            </label>

            {selectedImages.length > 0 && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {selectedImages.map((image, index) => (
                  <article
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <img
                        src={image.previewUrl}
                        alt={`Selected property image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      {index === 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-[#0B1F3A]">
                          Cover Image
                        </span>
                      )}

                      <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                    </div>

                    <div className="p-4">
                      <p
                        className="truncate text-sm font-semibold text-slate-800"
                        title={image.file.name}
                      >
                        {image.file.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {(image.file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => moveImage(image.id, "left")}
                          disabled={index === 0 || submitting}
                          className="rounded-lg border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ←
                        </button>

                        <button
                          type="button"
                          onClick={() => removeSelectedImage(image.id)}
                          disabled={submitting}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Remove
                        </button>

                        <button
                          type="button"
                          onClick={() => moveImage(image.id, "right")}
                          disabled={
                            index === selectedImages.length - 1 || submitting
                          }
                          className="rounded-lg border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {uploadProgress && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-800">
              {uploadProgress}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-[#0B1F3A] transition hover:bg-[#e4c45c] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting ? "Saving Property..." : "Save Property"}
          </button>
        </form>
      </section>
    </main>
  );
}