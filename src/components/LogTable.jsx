import React, { useState } from "react";
// 1. IMPORT USEAUTH UNTUK CEK ROLE
import { useAuth } from "../context/AuthContext";

const LogTable = ({ logs, inventory, onReturnItem }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth(); // 2. AMBIL DATA USER YANG SEDANG LOGIN

  // 3. BIKIN VARIABEL PENGECEK ADMIN
  const isAdmin = user?.user_metadata?.role === "admin";

  const enrichedLogs = logs.map((log) => {
    const item = inventory.find((i) => i.id === log.sparepart_id);
    return {
      ...log,
      itemName: item ? item.name : "Barang Dihapus/Hilang",
    };
  });

  const filteredLogs = enrichedLogs.filter((log) => {
    return (
      log.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.borrower.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.machine.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📋 Riwayat Transaksi</h1>
            <div className="text-sm text-gray-500 mt-1">
              Menampilkan {filteredLogs.length} dari {logs.length} catatan
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Cari part, nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="p-4 border-b">Tanggal Pinjam</th>
                <th className="p-4 border-b">Nama Barang</th>
                <th className="p-4 border-b">Peminjam</th>
                <th className="p-4 border-b">Mesin & Alasan</th>
                <th className="p-4 border-b text-center">Status</th>
                <th className="p-4 border-b text-center">Tanggal Kembali</th>
                <th className="p-4 border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 border-b">
                    <td className="p-4 font-mono text-gray-600">{log.date_borrowed}</td>
                    <td className="p-4 font-bold text-indigo-600">{log.itemName}</td>
                    <td className="p-4">{log.borrower}</td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{log.machine}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">{log.reason}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${log.status === "Returned" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono text-gray-500">
                      {log.date_returned ? log.date_returned.split("T")[0] : "-"}
                    </td>
                    
                    {/* 4. LOGIKA TOMBOL AKSI BERDASARKAN ROLE */}
                    <td className="p-4 text-center">
                      {log.status === "Borrowed" ? (
                        isAdmin ? (
                          <button
                            onClick={() => onReturnItem(log.id)}
                            className="bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm"
                          >
                            Selesai / Kembali
                          </button>
                        ) : (
                          <span className="text-xs text-yellow-600 italic font-medium">Sedang Dipinjam</span>
                        )
                      ) : (
                        <span className="text-gray-400 text-xs italic">Selesai ✓</span>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">Belum ada riwayat transaksi. 📭</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogTable;