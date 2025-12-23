import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth(); // 2. Ambil data user & fungsi logout

  const getLinkClass = (path) => {
    const baseClass =
      "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200";
    const activeClass = "bg-indigo-900 text-white shadow-inner"; // Sedikit digelapkan biar kontras
    const inactiveClass =
      "text-indigo-100 hover:bg-indigo-700 hover:text-white";

    return location.pathname === path
      ? `${baseClass} ${activeClass}`
      : `${baseClass} ${inactiveClass}`;
  };

  return (
    <nav className="bg-indigo-800 shadow-lg mb-6 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* BAGIAN KIRI: Logo & Menu */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-2xl">🏭</span>
              <span className="font-bold text-lg tracking-wide hidden md:block">
                SparepartApp
              </span>
            </div>

            {/* Menu Navigasi */}
            <div className="flex space-x-2">
              <Link to="/" className={getLinkClass("/")}>
                📦 Inventory
              </Link>
              <Link to="/logs" className={getLinkClass("/logs")}>
                📋 History
              </Link>
            </div>
          </div>

          {/* BAGIAN KANAN: User Info & Logout */}
          <div className="flex items-center gap-4">
            {/* Info User */}
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold">
                Halo, {user?.username} 👋
              </div>
              <div className="text-xs text-indigo-200 uppercase tracking-wider font-bold">
                {user?.role}
              </div>
            </div>

            {/* Tombol Logout */}
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition shadow-sm border border-red-500"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
