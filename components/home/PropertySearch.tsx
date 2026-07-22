export default function PropertySearch() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-8 shadow-xl">

        <h2 className="mb-8 text-3xl font-bold text-gray-900">
          Find Your Next Home
        </h2>

        <div className="grid gap-4 md:grid-cols-6">

          <input
            type="text"
            placeholder="Location"
            className="rounded-lg border p-3"
          />

          <select className="rounded-lg border p-3">
            <option>Property Type</option>
            <option>Apartment</option>
            <option>House</option>
            <option>Detached</option>
          </select>

          <select className="rounded-lg border p-3">
            <option>Bedrooms</option>
            <option>1+</option>
            <option>2+</option>
            <option>3+</option>
            <option>4+</option>
          </select>

          <input
            type="number"
            placeholder="Min Rent"
            className="rounded-lg border p-3"
          />

          <input
            type="number"
            placeholder="Max Rent"
            className="rounded-lg border p-3"
          />

          <button className="rounded-lg bg-blue-900 text-white hover:bg-blue-800">
            Search
          </button>

        </div>

      </div>
    </section>
  );
}