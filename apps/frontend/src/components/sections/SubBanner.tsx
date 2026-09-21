const SubBanner = () => {
  return (
    <section className="bg-slate-600">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-2xl font-semibold text-white ">
              Platform Administration
            </h3>

            <p className="mt-2 text-sm text-blue-100">
              Manage users, municipalities, provinces, and districts efficiently.
            </p>
          </div>

          <button className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
            <a href ="/users">
            View Users
            </a>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SubBanner;