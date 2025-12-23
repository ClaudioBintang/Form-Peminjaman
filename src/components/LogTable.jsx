import React from "react";
import { useAuth } from "../context/AuthContext";
// TERIMA PROPS BARU: onReturnItem
const LogTable = ({ logs, inventory, onReturnItem }) => {
  const { user } = useAuth(); // 2. Ambil data user yang sedang login

  const getItemName = (id) => {
    const item = inventory.find((i) => i.id === id);
    return item ? item.name : "Barang Dihapus";
  };

  return (
    <div className="p-6 bg-gray-50 mt-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📋 Riwayat Transaksi (Logbook)
        </h2>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800 text-white text-sm">
              <tr>
                <th className="p-3">Tanggal Pinjam</th>
                <th className="p-3">Peminjam</th>
                <th className="p-3">Barang</th>
                <th className="p-3">Mesin</th>
                <th className="p-3 text-center">Status</th>
                {/* Kolom Aksi hanya judulnya saja, isinya nanti dikondisikan */}
                <th className="p-3 text-center">Aksi (Admin)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {logs
                .slice()
                .reverse()
                .map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-mono">
                      <div>{log.dateBorrowed}</div>
                      {log.dateReturned && (
                        <div className="text-xs text-green-600 mt-1">
                          Kembali: {log.dateReturned}
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-semibold">{log.borrower}</td>

                    <td className="p-3 text-blue-600">
                      {getItemName(log.sparepartId)}
                    </td>

                    <td className="p-3">
                      {log.machine}
                      <div className="text-xs text-gray-400 italic">
                        "{log.reason}"
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          log.status === "Returned"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {log.status === "Returned" ? "SELESAI" : "DIPINJAM"}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      {/* LOGIC SAKTI DI SINI 👇 */}
                      {/* Tombol hanya muncul JIKA: User adalah ADMIN -DAN- Status masih BORROWED */}

                      {user.role === "admin" && log.status === "Borrowed" && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Yakin barang ini sudah dikembalikan/diganti?"
                              )
                            ) {
                              onReturnItem(log.id);
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition shadow-sm"
                        >
                          ✅ Terima
                        </button>
                      )}

                      {/* Kalau user BUKAN admin, tapi status Borrowed */}
                      {user.role !== "admin" && log.status === "Borrowed" && (
                        <span className="text-gray-400 text-xs italic">
                          Hubungi Admin
                        </span>
                      )}

                      {log.status === "Returned" && (
                        <span className="text-gray-400 text-xs">Done</span>
                      )}
                    </td>
                  </tr>
                ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    Belum ada data transaksi.
                  </td>
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
