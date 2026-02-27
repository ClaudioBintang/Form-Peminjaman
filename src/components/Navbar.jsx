import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Membaca Metadata dari Supabase
  // Jika belum disetting, kita tampilkan emailnya saja sebagai cadangan
  const namaDivisi = user?.user_metadata?.name || user?.email;
  const roleDivisi = user?.user_metadata?.role || "teknisi";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      alert("Gagal logout!");
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo / Judul */}
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">⚙️ Sparepart Hub</span>
          
          {/* Menu Navigasi */}
          <div className="hidden md:flex gap-4 ml-6 text-sm">
            <Link to="/" className="hover:text-indigo-200 transition">Inventory</Link>
            <Link to="/logs" className="hover:text-indigo-200 transition">Riwayat Transaksi</Link>
          </div>
        </div>

        {/* Profil & Logout */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="font-bold text-sm">{namaDivisi}</div>
            <div className="text-xs text-indigo-200 uppercase tracking-wider">
              {roleDivisi === "admin" ? "👑 Administrator" : "👷‍♂️ Teknisi"}
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;