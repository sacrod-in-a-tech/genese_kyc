import { useEffect, useState } from "react";

import { useAuth } from "../../auth/AuthContext";
import { api, ApiError, type User } from "../../lib/api";

export function HeroSection() {
  const { token } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  function loadUsers() {
    if (!token) return;

    api
      .getUsers(token)
      .then(setUsers)
      .catch((err) =>
        setError(
          err instanceof ApiError ? err.message : "Failed to load users",
        ),
      );
  }

  useEffect(() => {
    loadUsers();
  }, [token]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Page Header */}
        <section className="rounded-2xl bg-slate-200 p-6 shadow-sm ring-1 ring-slate-200 sm:p-8 ">
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome to the Dashboard Page
            </h1>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-2 text-left">
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Overview of the System</h2>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Users Summary */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 text-left">
                Total Users
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Currently registered users in the system.
              </p>
            </div>

            <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {users.length} {users.length === 1 ? "User" : "Users"}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
