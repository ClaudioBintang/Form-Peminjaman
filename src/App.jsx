import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import { supabase } from "./data/supabaseClient.js";

import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage.jsx";
import InventoryTable from "./components/InventoryTable";
import LogTable from "./components/LogTable";

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  const [inventory, setInventory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Ambil data dari Supabase saat aplikasi dibuka
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    
    // Ambil data inventory
    const { data: invData, error: invErr } = await supabase
      .from("inventory")
      .select("*")
      .order("id", { ascending: true });

    // Ambil data logs
    const { data: logData, error: logErr } = await supabase
      .from("logs")
      .select("*")
      .order("id", { ascending: false });

    if (!invErr) setInventory(invData || []);
    if (!logErr) setLogs(logData || []);
    
    setLoading(false);
  };

  // --- FUNGSI 1: KEMBALIKAN BARANG (RETURN) ---
  const handleReturnItem = async (logId) => {
    const targetLog = logs.find((log) => log.id === logId);
    if (!targetLog) return;

    // A. Update Status Log di Supabase
    const { error: logError } = await supabase
      .from("logs")
      .update({ 
        status: "Returned", 
        date_returned: new Date().toISOString() 
      })
      .eq("id", logId);

    if (logError) return alert("Gagal update log!");

    // B. Cari item di inventory & Update Stok (+1)
    const targetItem = inventory.find((item) => item.id === targetLog.sparepart_id);
    
    if (targetItem) {
      const { error: invError } = await supabase
        .from("inventory")
        .update({ stock: targetItem.stock + 1 })
        .eq("id", targetItem.id);

      if (invError) return alert("Gagal update stok!");

      // C. Update State Lokal agar UI berubah
      setLogs(logs.map(l => l.id === logId ? { ...l, status: "Returned", date_returned: "Barusan" } : l));
      setInventory(inventory.map(i => i.id === targetItem.id ? { ...i, stock: i.stock + 1 } : i));
      
      alert("Barang berhasil dikembalikan!");
    }
  };

  // --- FUNGSI 2: TAMBAH BARANG BARU ---
  const handleAddNewItem = async (newItemData) => {
    // MAPPING: React -> Supabase
    const dataToInsert = {
      name: newItemData.name,
      category: newItemData.category,
      location: newItemData.location,
      stock: parseInt(newItemData.stock),
      min_stock: parseInt(newItemData.minStock), // Snake Case
      unit: newItemData.unit
    };

    const { data, error } = await supabase
      .from("inventory")
      .insert([dataToInsert])
      .select();

    if (error) {
      alert("Gagal tambah barang: " + error.message);
    } else {
      setInventory([...inventory, data[0]]);
      alert("Sparepart baru berhasil ditambahkan!");
    }
  };

  // --- FUNGSI 3: TRANSAKSI PINJAM (BARU) ---
  const handleTransaction = async (updatedItem, newLogData) => {
    // A. Update Stok di Supabase
    const { error: invError } = await supabase
      .from("inventory")
      .update({ stock: updatedItem.stock })
      .eq("id", updatedItem.id);

    if (invError) return alert("Gagal update stok!");

    // B. Simpan Log Baru (Mapping ke Snake Case)
    const logToInsert = {
      sparepart_id: updatedItem.id,
      borrower: newLogData.borrower,
      machine: newLogData.machine,
      reason: newLogData.reason,
      status: "Borrowed",
      date_borrowed: new Date().toISOString().split("T")[0]
    };

    const { data: savedLog, error: logError } = await supabase
      .from("logs")
      .insert([logToInsert])
      .select();

    if (logError) return alert("Gagal simpan log!");

    // C. Update State Lokal
    setInventory(inventory.map(i => i.id === updatedItem.id ? updatedItem : i));
    setLogs([savedLog[0], ...logs]);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-gray-50 min-h-screen">
          {loading ? (
            <div className="flex h-screen items-center justify-center font-bold text-gray-400">
              Menghubungkan ke Cloud... ☁️
            </div>
          ) : (
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/"
                element={
                  <RequireAuth>
                    <InventoryTable
                      inventory={inventory}
                      logs={logs}
                      onTransaction={handleTransaction} // Ganti ke fungsi baru
                      onAddItem={handleAddNewItem}
                    />
                  </RequireAuth>
                }
              />

              <Route
                path="/logs"
                element={
                  <RequireAuth>
                    <LogTable
                      logs={logs}
                      inventory={inventory}
                      onReturnItem={handleReturnItem}
                    />
                  </RequireAuth>
                }
              />
            </Routes>
          )}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;