import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage.jsx";
import InventoryTable from "./components/InventoryTable";
import LogTable from "./components/LogTable";
import { initialInventory, initialLogs } from "./data/sparepart.js";

const RequireAuth = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar /> {/* Navbar hanya muncul kalau user sudah login */}
      {children}
    </>
  );
};

function App() {
  //state data inventory
  const [inventory, setInventory] = useState(() => {
    const savedInv = localStorage.getItem("sparepart_inventory");
    return savedInv ? JSON.parse(savedInv) : initialInventory;
  });

  const [logs, setLogs] = useState(() => {
    const savedLogs = localStorage.getItem("sparepart_logs");
    return savedLogs ? JSON.parse(savedLogs) : initialLogs;
  });

  useEffect(() => {
    localStorage.setItem("sparepart_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("sparepart_logs", JSON.stringify(logs));
  }, [logs]);

  // --- FUNGSI LOGIC (Return Barang) ---
  const handleReturnItem = (logId) => {
    const targetLog = logs.find((log) => log.id === logId);
    if (!targetLog) return;

    const updatedLogs = logs.map((log) => {
      if (log.id === logId) {
        return {
          ...log,
          status: "Returned",
          dateReturned: new Date().toISOString().split("T")[0],
        };
      }
      return log;
    });
    setLogs(updatedLogs);

    const updatedInventory = inventory.map((item) => {
      if (item.id === targetLog.sparepartId) {
        return { ...item, stock: item.stock + 1 };
      }
      return item;
    });
    setInventory(updatedInventory);

    alert("Barang berhasil dikembalikan. Stok bertambah +1.");
  };
  const handleAddNewItem = (newItemData) => {
    const newItem = {
      id: Date.now().toString(),
      ...newItemData,
    };
    setInventory([...inventory, newItem]);
    alert("Sparepart baru berhasil ditambahkan!");
  }
  return (
    // 1. Bungkus semuanya dengan AuthProvider
    <AuthProvider>
      <BrowserRouter>
        <div className="bg-gray-50 min-h-screen">
          <Routes>
            {/* RUTE PUBLIC: Halaman Login (Siapa saja boleh akses) */}
            <Route path="/login" element={<LoginPage />} />

            {/* RUTE PRIVATE: Perlu Login */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <InventoryTable
                    inventory={inventory}
                    logs={logs}
                    onUpdateInventory={setInventory}
                    onUpdateLogs={setLogs}
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
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
