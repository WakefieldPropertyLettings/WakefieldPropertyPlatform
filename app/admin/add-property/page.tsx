"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

export default function AddPropertyPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
const [deposit, setDeposit] = useState("");
const [availableFrom, setAvailableFrom] = useState("");
const [propertyType, setPropertyType] = useState("House");

const [address, setAddress] = useState("");
const [postcode, setPostcode] = useState("");
const [googleMap, setGoogleMap] = useState("");

const [parking, setParking] = useState(false);
const [garden, setGarden] = useState(false);
const [furnished, setFurnished] = useState(false);
const [billsIncluded, setBillsIncluded] = useState(false);
const [petFriendly, setPetFriendly] = useState(false);

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
      description,
      location,
      address,
      postcode,
      google_map: googleMap,

      price,
      deposit,
      available_from: availableFrom,
      property_type: propertyType,

      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area,

      parking,
      garden,
      furnished,
      bills_included: billsIncluded,
      pet_friendly: petFriendly,

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
    Property Description
  </label>

  <textarea
    rows={6}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="w-full rounded-lg border p-3"
    placeholder="Describe the property, nearby amenities, transport links, and key features..."
  />
</div>
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

{/* NEW SECTION STARTS HERE */}

<div className="grid gap-6 md:grid-cols-3">

  <div>
    <label className="mb-2 block font-semibold">
      Deposit
    </label>

    <input
      type="text"
      value={deposit}
      onChange={(e) => setDeposit(e.target.value)}
      className="w-full rounded-lg border p-3"
      placeholder="£1000"
    />
  </div>

  <div>
    <label className="mb-2 block font-semibold">
      Available From
    </label>

    <input
      type="date"
      value={availableFrom}
      onChange={(e) => setAvailableFrom(e.target.value)}
      className="w-full rounded-lg border p-3"
    />
  </div>

  <div>
    <label className="mb-2 block font-semibold">
      Property Type
    </label>

    <select
      value={propertyType}
      onChange={(e) => setPropertyType(e.target.value)}
      className="w-full rounded-lg border p-3"
    >
      <option>House</option>
      <option>Flat</option>
      <option>Apartment</option>
      <option>Studio</option>
      <option>Bungalow</option>
    </select>
  </div>

</div>

{/* EXISTING SECTION CONTINUES */}

<div className="grid gap-6 md:grid-cols-3">
          </div>
{/* Property Location */}

<div className="border-t pt-8">

  <h2 className="mb-6 text-2xl font-bold text-[#0B1F3A]">
    Property Location
  </h2>

  <div className="grid gap-6 md:grid-cols-2">

    <div>
      <label className="mb-2 block font-semibold">
        Property Address
      </label>

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full rounded-lg border p-3"
        placeholder="123 High Street"
      />
    </div>

    <div>
      <label className="mb-2 block font-semibold">
        Postcode
      </label>

      <input
        type="text"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
        className="w-full rounded-lg border p-3"
        placeholder="WF1 2AB"
      />
    </div>

  </div>

  <div className="mt-6">

    <label className="mb-2 block font-semibold">
      Google Maps URL
    </label>

    <input
      type="text"
      value={googleMap}
      onChange={(e) => setGoogleMap(e.target.value)}
      className="w-full rounded-lg border p-3"
      placeholder="https://maps.google.com/..."
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
{/* Property Features */}

<div className="border-t pt-8">

  <h2 className="mb-6 text-2xl font-bold text-[#0B1F3A]">
    Property Features
  </h2>

  <div className="grid grid-cols-2 gap-5 md:grid-cols-3">

    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={parking}
        onChange={(e) => setParking(e.target.checked)}
      />
      Parking
    </label>

    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={garden}
        onChange={(e) => setGarden(e.target.checked)}
      />
      Garden
    </label>

    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={furnished}
        onChange={(e) => setFurnished(e.target.checked)}
      />
      Furnished
    </label>

    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={billsIncluded}
        onChange={(e) => setBillsIncluded(e.target.checked)}
      />
      Bills Included
    </label>

    <label className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={petFriendly}
        onChange={(e) => setPetFriendly(e.target.checked)}
      />
      Pet Friendly
    </label>

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