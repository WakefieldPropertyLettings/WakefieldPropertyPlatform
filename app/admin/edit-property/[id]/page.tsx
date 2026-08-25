"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type ExistingImage = {
  id: number;
  property_id: number;
  image_url: string;
  sort_order: number | null;
};

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

const MAX_IMAGES = 20;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const STORAGE_BUCKET = "property-images";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const rawId = params.id;
  const propertyId = Number(Array.isArray(rawId) ? rawId[0] : rawId);

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
  const [propertyStatus, setPropertyStatus] = useState("available");

  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");

  const [parking, setParking] = useState(false);
  const [garden, setGarden] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [billsIncluded, setBillsIncluded] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [featured, setFeatured] = useState(false);

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!Number.isInteger(propertyId) || propertyId <= 0) {
      router.replace("/admin");
      return;
    }

    void loadProperty();
  }, [propertyId]);

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [selectedImages]);

  async function loadProperty() {
    setLoading(true);
    setErrorMessage("");

    try {
      const [
        { data: property, error: propertyError },
        { data: gallery, error: galleryError },
      ] = await Promise.all([
        supabase
          .from("properties")
          .select("*")
          .eq("id", propertyId)
          .single(),

        supabase
          .from("property_images")
          .select("id, property_id, image_url, sort_order")
          .eq("property_id", propertyId)
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true }),
      ]);

      if (propertyError || !property) {
        throw new Error(
          propertyError?.message || "Property could not be found."
        );
      }

      if (galleryError) {
        console.error("Gallery loading error:", galleryError);
      }

      setTitle(property.title ?? "");
      setDescription(property.description ?? "");

      setLocation(property.location ?? "");
      setAddress(property.address ?? "");
      setPostcode(property.postcode ?? "");
      setGoogleMap(property.google_map ?? "");

      setPrice(
        property.price !== null && property.price !== undefined
          ? String(property.price)
          : ""
      );

      setDeposit(
        property.deposit !== null && property.deposit !== undefined
          ? String(property.deposit)
          : ""
      );

      setAvailableFrom(property.available_from ?? "");
      
      setPropertyStatus(property.status ?? "available");

      setBedrooms(
        property.bedrooms !== null && property.bedrooms !== undefined
          ? String(property.bedrooms)
          : ""
      );

      setBathrooms(
        property.bathrooms !== null && property.bathrooms !== undefined
          ? String(property.bathrooms)
          : ""
      );

      setArea(property.area ?? "");

      setParking(Boolean(property.parking));
      setGarden(Boolean(property.garden));
      setFurnished(Boolean(property.furnished));
      setBillsIncluded(Boolean(property.bills_included));
      setPetFriendly(Boolean(property.pet_friendly));
      setFeatured(Boolean(property.featured));

      let loadedImages = (gallery as ExistingImage[] | null) ?? [];

      /*
       * Supports older properties where the cover image exists in
       * properties.image but was not added to property_images.
       */
      if (
        property.image &&
        !loadedImages.some(
          (galleryImage) => galleryImage.image_url === property.image
        )
      ) {
        loadedImages = [
          {
            id: -1,
            property_id: propertyId,
            image_url: property.image,
            sort_order: -1,
          },
          ...loadedImages,
        ];
      }

      setExistingImages(loadedImages);
    } catch (error) {
      console.error("Property loading error:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "The property could not be loaded."
      );

      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  }

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

    const currentTotal = existingImages.length + selectedImages.length;
    const remainingSpaces = MAX_IMAGES - currentTotal;

    if (remainingSpaces <= 0) {
      setErrorMessage(
        `This property already has the maximum of ${MAX_IMAGES} images.`
      );

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
          `${file.name} is larger than 10 MB. Please choose a smaller image.`
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

  function moveSelectedImage(
    imageId: string,
    direction: "left" | "right"
  ) {
    setSelectedImages((current) => {
      const currentIndex = current.findIndex(
        (image) => image.id === imageId
      );

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

  async function moveExistingImage(
    imageId: number,
    direction: "left" | "right"
  ) {
    const currentIndex = existingImages.findIndex(
      (image) => image.id === imageId
    );

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= existingImages.length) {
      return;
    }

    const reordered = [...existingImages];
    const [movedImage] = reordered.splice(currentIndex, 1);

    reordered.splice(targetIndex, 0, movedImage);

    setExistingImages(reordered);

    await saveExistingImageOrder(reordered);
  }

  async function makeExistingImageCover(imageId: number) {
    const currentIndex = existingImages.findIndex(
      (image) => image.id === imageId
    );

    if (currentIndex <= 0) {
      return;
    }

    const reordered = [...existingImages];
    const [selectedImage] = reordered.splice(currentIndex, 1);

    reordered.unshift(selectedImage);

    setExistingImages(reordered);

    await saveExistingImageOrder(reordered);

    const { error } = await supabase
      .from("properties")
      .update({
        image: selectedImage.image_url,
      })
      .eq("id", propertyId);

    if (error) {
      console.error("Cover image update error:", error);
      setErrorMessage("The cover image could not be updated.");
    }
  }

  async function saveExistingImageOrder(images: ExistingImage[]) {
    const validImages = images.filter((image) => image.id > 0);

    if (validImages.length === 0) {
      return;
    }

    const updates = validImages.map((image, index) =>
      supabase
        .from("property_images")
        .update({
          sort_order: index,
        })
        .eq("id", image.id)
    );

    const results = await Promise.all(updates);
    const failedUpdate = results.find((result) => result.error);

    if (failedUpdate?.error) {
      console.error(
        "Image order update error:",
        failedUpdate.error
      );

      setErrorMessage("The image order could not be saved.");
    }
  }

  function getStorageLocation(publicUrl: string) {
    try {
      const decodedUrl = decodeURIComponent(publicUrl);

      const match = decodedUrl.match(
        /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/
      );

      if (!match) {
        return null;
      }

      return {
        bucket: match[1],
        path: match[2],
      };
    } catch {
      return null;
    }
  }

  async function deleteExistingImage(image: ExistingImage) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed || saving) {
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const storageLocation = getStorageLocation(image.image_url);

      if (storageLocation) {
        const { error: storageError } = await supabase.storage
          .from(storageLocation.bucket)
          .remove([storageLocation.path]);

        if (storageError) {
          console.warn(
            "Storage image deletion warning:",
            storageError
          );
        }
      }

      if (image.id > 0) {
        const { error: databaseError } = await supabase
          .from("property_images")
          .delete()
          .eq("id", image.id);

        if (databaseError) {
          throw new Error(databaseError.message);
        }
      }

      const remainingImages = existingImages.filter(
        (currentImage) => currentImage.id !== image.id
      );

      setExistingImages(remainingImages);

      await saveExistingImageOrder(remainingImages);

      const nextCoverImage = remainingImages[0]?.image_url ?? "";

      const { error: coverError } = await supabase
        .from("properties")
        .update({
          image: nextCoverImage,
        })
        .eq("id", propertyId);

      if (coverError) {
        throw new Error(coverError.message);
      }

      setStatusMessage("Image deleted successfully.");
    } catch (error) {
      console.error("Delete image error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The image could not be deleted."
      );
    } finally {
      setSaving(false);
    }
  }

  async function uploadNewImages() {
    if (selectedImages.length === 0) {
      return [];
    }

    const startingOrder = existingImages.length;

    const uploadedImages: {
      property_id: number;
      image_url: string;
      sort_order: number;
    }[] = [];

    for (let index = 0; index < selectedImages.length; index += 1) {
      const selectedImage = selectedImages[index];

      setStatusMessage(
        `Uploading image ${index + 1} of ${selectedImages.length}...`
      );

      const safeFileName = sanitiseFileName(
        selectedImage.file.name
      );

      const storagePath =
        `${propertyId}/` +
        `${Date.now()}-${index}-${crypto.randomUUID()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, selectedImage.file, {
          cacheControl: "3600",
          upsert: false,
          contentType: selectedImage.file.type,
        });

      if (uploadError) {
        throw new Error(
          `Failed to upload ${selectedImage.file.name}: ` +
            uploadError.message
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(storagePath);

      uploadedImages.push({
        property_id: propertyId,
        image_url: publicUrlData.publicUrl,
        sort_order: startingOrder + index,
      });
    }

    const { data, error } = await supabase
      .from("property_images")
      .insert(uploadedImages)
      .select("id, property_id, image_url, sort_order");

    if (error) {
      throw new Error(error.message);
    }

    return (data as ExistingImage[] | null) ?? [];
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setStatusMessage("Saving property information...");

    try {
      if (!title.trim()) {
        throw new Error("Please enter a property title.");
      }

      if (!location.trim() && !postcode.trim()) {
        throw new Error("Please enter a location or postcode.");
      }

      if (!price || Number(price) <= 0) {
        throw new Error("Please enter a valid monthly rent.");
      }

      const newlyUploadedImages = await uploadNewImages();

      const allImages = [...existingImages, ...newlyUploadedImages];

      const coverImageUrl = allImages[0]?.image_url ?? "";

      const { error: propertyError } = await supabase
        .from("properties")
        .update({
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
          status: propertyStatus,
          bedrooms: bedrooms ? Number(bedrooms) : 0,
          bathrooms: bathrooms ? Number(bathrooms) : 0,
          area: area.trim(),

          parking,
          garden,
          furnished,
          bills_included: billsIncluded,
          pet_friendly: petFriendly,

          image: coverImageUrl,
          featured,
        })
        .eq("id", propertyId);

      if (propertyError) {
        throw new Error(propertyError.message);
      }

      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });

      setSelectedImages([]);
      setExistingImages(allImages);
      setStatusMessage("Property updated successfully.");

      window.alert("Property updated successfully.");

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Property update error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The property could not be updated."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#0B1F3A]" />

          <p className="mt-4 font-semibold text-[#0B1F3A]">
            Loading property...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-[#0B1F3A] py-14 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">
            Admin dashboard
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Edit Property
          </h1>

          <p className="mt-3 text-gray-300">
            Update the property information and manage its photographs.
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
              className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          {statusMessage && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-800">
              {statusMessage}
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
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block font-semibold"
            >
              Property Description
            </label>

            <textarea
              id="description"
              rows={7}
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border p-3"
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
            />
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
                onChange={(event) =>
                  setAvailableFrom(event.target.value)
                }
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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
                onChange={(event) =>
                  setPropertyType(event.target.value)
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="House">House</option>
                <option value="Flat">Flat</option>
                <option value="Apartment">Apartment</option>
                <option value="Studio">Studio</option>
                <option value="Room">Room</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Ensuite">Ensuite</option>
              </select>
            </div>
<div>
  <label
    htmlFor="property-status"
    className="mb-2 block font-semibold"
  >
    Property Status
  </label>

  <select
    id="property-status"
    value={propertyStatus}
    onChange={(event) =>
      setPropertyStatus(event.target.value)
    }
    className="w-full rounded-lg border p-3"
  >
    <option value="available">
      Available
    </option>

    <option value="reserved">
      Reserved
    </option>

    <option value="let_agreed">
      Let Agreed
    </option>
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
                onChange={(event) =>
                  setBedrooms(event.target.value)
                }
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
                onChange={(event) =>
                  setBathrooms(event.target.value)
                }
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
                  onChange={(event) =>
                    setParking(event.target.checked)
                  }
                />
                Parking
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={garden}
                  onChange={(event) =>
                    setGarden(event.target.checked)
                  }
                />
                Garden
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={furnished}
                  onChange={(event) =>
                    setFurnished(event.target.checked)
                  }
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
                  onChange={(event) =>
                    setPetFriendly(event.target.checked)
                  }
                />
                Pet Friendly
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(event) =>
                    setFeatured(event.target.checked)
                  }
                />
                Featured Property
              </label>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#0B1F3A]">
                  Existing Images
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  The first image is used as the property cover.
                </p>
              </div>

              <p className="text-sm font-semibold text-[#0B1F3A]">
                {existingImages.length + selectedImages.length}/
                {MAX_IMAGES} images
              </p>
            </div>

            {existingImages.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-600">
                This property currently has no images.
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {existingImages.map((image, index) => (
                  <article
                    key={`${image.id}-${image.image_url}`}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <img
                        src={image.image_url}
                        alt={`Property image ${index + 1}`}
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

                    <div className="space-y-3 p-4">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            makeExistingImageCover(image.id)
                          }
                          disabled={saving}
                          className="w-full rounded-lg bg-[#D4AF37] px-3 py-2 text-sm font-bold text-[#0B1F3A]"
                        >
                          Make Cover
                        </button>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            moveExistingImage(image.id, "left")
                          }
                          disabled={index === 0 || saving}
                          className="rounded-lg border px-3 py-2 font-semibold disabled:opacity-40"
                        >
                          ←
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteExistingImage(image)
                          }
                          disabled={saving}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveExistingImage(image.id, "right")
                          }
                          disabled={
                            index === existingImages.length - 1 ||
                            saving
                          }
                          className="rounded-lg border px-3 py-2 font-semibold disabled:opacity-40"
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

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-[#0B1F3A]">
              Upload More Images
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Select multiple JPG, PNG or WebP files. Maximum 10 MB each.
            </p>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center hover:border-[#D4AF37] hover:bg-amber-50">
              <span className="text-lg font-bold text-[#0B1F3A]">
                Choose Multiple Images
              </span>

              <span className="mt-2 text-sm text-gray-500">
                The selected files will be added after the existing images.
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageSelection}
                disabled={
                  saving ||
                  existingImages.length + selectedImages.length >=
                    MAX_IMAGES
                }
                className="sr-only"
              />
            </label>

            {selectedImages.length > 0 && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {selectedImages.map((image, index) => (
                  <article
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <img
                        src={image.previewUrl}
                        alt={`New image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                        New Image
                      </span>
                    </div>

                    <div className="p-4">
                      <p className="truncate text-sm font-semibold">
                        {image.file.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {(image.file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            moveSelectedImage(image.id, "left")
                          }
                          disabled={index === 0 || saving}
                          className="rounded-lg border px-3 py-2 font-semibold disabled:opacity-40"
                        >
                          ←
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            removeSelectedImage(image.id)
                          }
                          disabled={saving}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                          Remove
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveSelectedImage(image.id, "right")
                          }
                          disabled={
                            index === selectedImages.length - 1 ||
                            saving
                          }
                          className="rounded-lg border px-3 py-2 font-semibold disabled:opacity-40"
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

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#D4AF37] px-8 py-4 font-bold text-[#0B1F3A] hover:bg-[#e4c45c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Updating Property..." : "Update Property"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin")}
              disabled={saving}
              className="rounded-xl border border-slate-300 px-8 py-4 font-bold text-[#0B1F3A] hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}