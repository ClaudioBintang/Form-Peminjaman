import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // --- PERBAIKAN DI SINI ---
  // Kita cek LocalStorage LANGSUNG di dalam useState.
  // Jadi saat detik pertama aplikasi jalan, data user sudah ada (tidak null lagi).
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("app_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  // Fungsi Login
  const login = (username, role) => {
    const newUser = { username, role };
    setUser(newUser);
    localStorage.setItem("app_user", JSON.stringify(newUser)); // Simpan ke browser
  };

  // Fungsi Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("app_user"); // Hapus dari browser
  };

  // Kita tidak butuh useEffect untuk "Load" lagi, karena sudah di-load di atas (useState).

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
