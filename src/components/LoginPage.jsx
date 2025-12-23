import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("teknisi"); // Default role: Teknisi

  const { login } = useAuth(); // Ambil fungsi login dari Context
  const navigate = useNavigate(); // Untuk pindah halaman setelah login

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username) return alert("Isi nama dulu le");

    // Panggil fungsi login dari AuthContext
    login(username, role);

    // Arahkan ke halaman utama (Inventory)
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            Selamat Datang
          </h1>
          <p className="text-gray-500">Sistem Manajemen Sparepart</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Input Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Kamu / NIK
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Contoh: Budi Santoso"
            />
          </div>

          {/* Pilihan Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login Sebagai
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="teknisi">👷‍♂️ Teknisi (User)</option>
              <option value="admin">👨‍💼 Admin (Management)</option>
            </select>
            <p className="text-xs text-gray-400 mt-2">
              *Pilih <b>Admin</b> untuk akses full control, atau <b>Teknisi</b>{" "}
              untuk meminjam barang.
            </p>
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md">
            Masuk ke Sistem 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
