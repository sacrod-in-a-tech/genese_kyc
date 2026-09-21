import { useState } from "react";

interface District {
  id: number;
  name: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const MunicipalitiesPage = () => {
  const [name, setName] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const districts: District[] = [
    { id: 1, name: "Kathmandu" },
    { id: 2, name: "Lalitpur" },
    { id: 3, name: "Bhaktapur" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter municipality name.");
      return;
    }

    if (!districtId) {
      setError("Please select a district.");
      return;
    }

    const payload = {
      name: trimmedName,
      district_id: Number(districtId),
    };

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/municipalities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.message || "Failed to create municipality.",
        );
      }

      setName("");
      setDistrictId("");
      setSuccess("Municipality created successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setDistrictId("");
    setError("");
    setSuccess("");
  };

  return (
    <section className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Municipality
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Create and manage municipalities by assigning them to their
            respective districts.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
            <h2 className="text-xl font-semibold text-slate-900">
              Municipality Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the municipality details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6 px-6 py-7 sm:px-8 sm:py-8">
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                >
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    htmlFor="municipality-name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Municipality Name
                  </label>

                  <input
                    id="municipality-name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    placeholder="Enter municipality name"
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="district"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    District
                  </label>

                  <select
                    id="district"
                    name="district_id"
                    value={districtId}
                    onChange={(e) => {
                      setDistrictId(e.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">Select district</option>

                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? "Creating..." : "Create Municipality"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MunicipalitiesPage;