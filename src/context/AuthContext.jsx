import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../data/supabaseClient";

// Membuat wadah/context untuk data Auth
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek apakah sudah ada sesi login yang tersimpan saat web dibuka
    const checkActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Jika ada sesi, simpan data usernya
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkActiveSession();

    // 2. Pantau terus kalau-kalau user tiba-tiba Logout atau Login
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Bersihkan pemantau saat komponen ditutup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // --- FUNGSI LOGIN (Sesuai dengan LoginPage.jsx) ---
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    // Jika Supabase bilang error (password salah/email ga ada), lempar errornya ke LoginPage
    if (error) {
      throw error; 
    }
    
    return data;
  };

  // --- FUNGSI LOGOUT ---
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Gagal Logout:", error.message);
    }
  };

  // Bungkus seluruh aplikasi dengan data user & fungsi auth
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Jangan tampilkan halaman sebelum status login selesai dicek */}
      {!loading ? children : (
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="text-xl font-bold text-indigo-600 animate-pulse">
            Memeriksa Akses Keamanan... 🔐
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// Custom Hook biar gampang panggil fungsi auth di komponen lain
export const useAuth = () => {
  return useContext(AuthContext);
};