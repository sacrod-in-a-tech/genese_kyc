import { useEffect, useState } from "react";

interface Province {
  id: string;
  name: string;
}

interface District {
  id: string;
  name: string;
  province_id?: string;
}

interface Municipality {
  id: string;
  name: string;
  district_id?: string;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const getResponseData = async <T,>(response: Response): Promise<T> => {
  const result = (await response.json()) as T | ApiResponse<T>;

  if (
    result &&
    typeof result === "object" &&
    "data" in result &&
    result.data !== undefined
  ) {
    return result.data as T;
  }

  return result as T;
};

const getErrorMessage = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  try {
    const data = (await response.json()) as {
      message?: string | string[];
      error?: string;
    };

    if (Array.isArray(data.message)) {
      return data.message.join(", ");
    }

    if (typeof data.message === "string") {
      return data.message;
    }

    if (data.error) {
      return data.error;
    }
  } catch {
    return fallback;
  }

  return fallback;
};

const ProvincesPage = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);

  const [provinceError, setProvinceError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [municipalityError, setMunicipalityError] = useState("");

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      setProvinceError("");

      try {
        const response = await fetch(`${API_BASE_URL}/admin/provinces`);

        if (!response.ok) {
          throw new Error(
            await getErrorMessage(
              response,
              "Failed to fetch provinces.",
            ),
          );
        }

        const data = await getResponseData<Province[]>(response);

        setProvinces(Array.isArray(data) ? data : []);
      } catch (error) {
        setProvinceError(
          error instanceof Error
            ? error.message
            : "Failed to fetch provinces.",
        );
        setProvinces([]);
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!selectedProvinceId) {
      setDistricts([]);
      setSelectedDistrictId("");
      setMunicipalities([]);
      return;
    }

    const fetchDistricts = async () => {
      setLoadingDistricts(true);
      setDistrictError("");
      setDistricts([]);
      setSelectedDistrictId("");
      setMunicipalities([]);

      try {
        const response = await fetch(
          `${API_BASE_URL}/provinces/${selectedProvinceId}/districts`,
        );

        if (!response.ok) {
          throw new Error(
            await getErrorMessage(
              response,
              "Failed to fetch districts.",
            ),
          );
        }

        const data = await getResponseData<District[]>(response);

        setDistricts(Array.isArray(data) ? data : []);
      } catch (error) {
        setDistrictError(
          error instanceof Error
            ? error.message
            : "Failed to fetch districts.",
        );
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [selectedProvinceId]);

  useEffect(() => {
    if (!selectedDistrictId) {
      setMunicipalities([]);
      return;
    }

    const fetchMunicipalities = async () => {
      setLoadingMunicipalities(true);
      setMunicipalityError("");
      setMunicipalities([]);

      try {
        const response = await fetch(
          `${API_BASE_URL}/districts/${selectedDistrictId}/municipalities`,
        );

        if (!response.ok) {
          throw new Error(
            await getErrorMessage(
              response,
              "Failed to fetch municipalities.",
            ),
          );
        }

        const data = await getResponseData<Municipality[]>(response);

        setMunicipalities(Array.isArray(data) ? data : []);
      } catch (error) {
        setMunicipalityError(
          error instanceof Error
            ? error.message
            : "Failed to fetch municipalities.",
        );
      } finally {
        setLoadingMunicipalities(false);
      }
    };

    fetchMunicipalities();
  }, [selectedDistrictId]);

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedProvinceId(event.target.value);
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedDistrictId(event.target.value);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Provinces
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Select a province to view its districts and municipalities.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-900">
                Provinces
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a province.
              </p>
            </div>

            <select
              value={selectedProvinceId}
              onChange={handleProvinceChange}
              disabled={loadingProvinces}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                {loadingProvinces
                  ? "Loading provinces..."
                  : "Select province"}
              </option>

              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>

            {provinceError && (
              <p className="mt-3 text-sm text-red-600">
                {provinceError}
              </p>
            )}

            {!loadingProvinces &&
              !provinceError &&
              provinces.length === 0 && (
                <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  No provinces found.
                </p>
              )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-900">
                Districts
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a district from the selected province.
              </p>
            </div>

            <select
              value={selectedDistrictId}
              onChange={handleDistrictChange}
              disabled={
                !selectedProvinceId ||
                loadingDistricts ||
                districts.length === 0
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                {!selectedProvinceId
                  ? "Select province first"
                  : loadingDistricts
                    ? "Loading districts..."
                    : "Select district"}
              </option>

              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>

            {districtError && (
              <p className="mt-3 text-sm text-red-600">
                {districtError}
              </p>
            )}

            {selectedProvinceId &&
              !loadingDistricts &&
              !districtError &&
              districts.length === 0 && (
                <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  No districts found.
                </p>
              )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-900">
                Municipalities
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Municipalities available in the selected district.
              </p>
            </div>

            {!selectedDistrictId ? (
              <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Select a district first.
              </div>
            ) : loadingMunicipalities ? (
              <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
                Loading municipalities...
              </div>
            ) : municipalityError ? (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {municipalityError}
              </div>
            ) : municipalities.length === 0 ? (
              <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
                No municipalities found.
              </div>
            ) : (
              <div className="space-y-2">
                {municipalities.map((municipality) => (
                  <div
                    key={municipality.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    {municipality.name}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProvincesPage;