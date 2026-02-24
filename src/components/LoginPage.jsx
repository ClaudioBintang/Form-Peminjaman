import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth(); // Pastikan AuthContext kamu sudah pakai versi Supabase
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi bos!");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(""); // Kosongkan error sebelumnya
      
      // Panggil fungsi login bawaan Supabase (dari AuthContext)
      await login(email, password);

      // Jika sukses, meluncur ke halaman utama
      navigate("/");
    } catch (error) {
      // Tangkap pesan error dari Supabase (misal: password salah)
      setErrorMsg(error.message || "Gagal login. Cek lagi email dan passwordnya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            Selamat Datang
          </h1>
          <p className="text-gray-500">Sistem Manajemen Sparepart Gudang</p>
        </div>

        {/* Tampilkan pesan error jika ada */}
        {errorMsg && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-6 rounded text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Input Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Divisi
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Contoh: maintenance@pabrik.com"
            />
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-3 rounded-lg transition duration-200 shadow-md ${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Mengecek Data... ⏳" : "Masuk ke Sistem 🚀"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Hanya akun divisi terdaftar yang dapat masuk.</p>
          <p>Hubungi Super Admin jika lupa password.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;