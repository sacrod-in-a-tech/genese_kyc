import { NavLink } from "react-router-dom";
import logo from "../../assets/hero.png";

const navItems = [
  { label: "Users", path: "/users" },
  { label: "Kycs", path: "/kyc" },
  { label: "Municipalities", path: "/municipalities" },
  { label: "Provinces", path: "/provinces" },
  { label: "Districts", path: "/districts" },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <NavLink to="/" className="text-xl font-bold text-slate-900">
        < img src={logo} alt="KYC Platform" className="h-8 w-8" />
        </NavLink>

        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Change Password
          </button>

          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            <NavLink to="/logout">
            Logout
            </NavLink>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;