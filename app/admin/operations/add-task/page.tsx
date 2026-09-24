"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Property = {
  id: number;
  title: string | null;
  address: string | null;
  postcode: string | null;
};

type SaveResponse = {
  success?: boolean;
  taskId?: number;
  error?: string;
};

export default function AddTaskPage() {
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [title, setTitle] = useState("");
  const [propertyId, setPropertyId] =
    useState("");
  const [dueDate, setDueDate] =
    useState("");
  const [dueTime, setDueTime] =
    useState("");
  const [priority, setPriority] =
    useState("normal");
  const [description, setDescription] =
    useState("");

  const [loadingProperties, setLoadingProperties] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadProperties() {
      setLoadingProperties(true);

      const {
        data,
        error: propertyError,
      } = await supabase
        .from("properties")
        .select(
          "id,title,address,postcode"
        )
        .order("title", {
          ascending: true,
        });

      if (propertyError) {
        console.error(
          "Task property loading error:",
          propertyError
        );

        setError(
          "Unable to load properties."
        );
      } else {
        setProperties(
          (data as Property[]) ?? []
        );
      }

      setLoadingProperties(false);
    }

    void loadProperties();
  }, [supabase]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");

    if (!title.trim()) {
      setError(
        "Please enter a task."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/admin/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            propertyId:
              propertyId || null,
            dueDate:
              dueDate || null,
            dueTime:
              dueTime || null,
            priority,
            description:
              description.trim() ||
              null,
          }),
        }
      );

      const data =
        (await response.json()) as SaveResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Unable to add task."
        );
      }

      router.push(
        "/admin/operations"
      );

      router.refresh();
    } catch (err) {
      console.error(
        "Add task error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to add task."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f6fa] px-6 py-28">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">
          <Link
            href="/admin/operations"
            className="text-sm font-semibold text-[#c98b25] hover:underline"
          >
            ← Back to Operations
          </Link>

          <h1 className="mt-4 font-serif text-4xl font-bold text-[#071b3a]">
            Add Task
          </h1>

          <p className="mt-3 text-slate-600">
            Add a property or office
            task that needs attention.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block font-semibold text-[#071b3a]"
            >
              Task
            </label>

            <input
              id="title"
              required
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="e.g. Change digital lock"
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-[#efad3f]"
            />
          </div>

          <div>
            <label
              htmlFor="property"
              className="mb-2 block font-semibold text-[#071b3a]"
            >
              Property
            </label>

            <select
              id="property"
              value={propertyId}
              onChange={(event) =>
                setPropertyId(
                  event.target.value
                )
              }
              disabled={
                loadingProperties
              }
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-[#efad3f]"
            >
              <option value="">
                General / Office Task
              </option>

              {properties.map(
                (property) => (
                  <option
                    key={property.id}
                    value={property.id}
                  >
                    {property.title ||
                      property.address ||
                      `Property ${property.id}`}
                    {property.postcode
                      ? ` - ${property.postcode}`
                      : ""}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="dueDate"
                className="mb-2 block font-semibold text-[#071b3a]"
              >
                Due Date
              </label>

              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-[#efad3f]"
              />
            </div>

            <div>
              <label
                htmlFor="dueTime"
                className="mb-2 block font-semibold text-[#071b3a]"
              >
                Due Time
              </label>

              <input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(event) =>
                  setDueTime(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-[#efad3f]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="mb-2 block font-semibold text-[#071b3a]"
            >
              Priority
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-[#efad3f]"
            >
              <option value="low">
                Low
              </option>

              <option value="normal">
                Normal
              </option>

              <option value="high">
                High
              </option>

              <option value="urgent">
                Urgent
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block font-semibold text-[#071b3a]"
            >
              Description / Notes
            </label>

            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Add any instructions or details..."
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-[#efad3f]"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#efad3f] px-6 py-3 font-bold text-[#071b3a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Adding Task..."
                : "Add Task"}
            </button>

            <Link
              href="/admin/operations"
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}