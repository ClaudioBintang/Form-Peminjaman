import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const InventoryTable = ({
  inventory,
  logs,
  onUpdateInventory,
  onUpdateLogs,
}) => {
  const { user } = useAuth(); // 2. Ambil User Login

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    borrower: "",
    machine: "",
    reason: "",
  });

  const filteredInventory = inventory.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleClickPinjam = (item) => {
    if (item.stock <= 0) {
      alert("Stok habis! Tidak bisa dipinjam.");
      return;
    }
    setSelectedItem(item);

    // 3. AUTO FILL NAMA PEMINJAM SAAT BUKA MODAL 👇
    setFormData({
      borrower: user.username, // Isi otomatis pakai nama login
      machine: "",
      reason: "",
    });

    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPinjam = (e) => {
    e.preventDefault();

    const updatedInventory = inventory.map((item) => {
      if (item.id === selectedItem.id) {
        return { ...item, stock: item.stock - 1 };
      }
      return item;
    });

    onUpdateInventory(updatedInventory);

    const newLog = {
      id: Date.now(),
      sparepartId: selectedItem.id,
      borrower: formData.borrower,
      machine: formData.machine,
      reason: formData.reason,
      dateBorrowed: new Date().toISOString().split("T")[0],
      status: "Borrowed",
    };

    onUpdateLogs([...logs, newLog]);

    alert(`Berhasil meminjam ${selectedItem.name}!`);
    setIsModalOpen(false);
    // Reset form, tapi nama tetap kita set ke user yang login (opsional)
    setFormData({ borrower: user.username, machine: "", reason: "" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              📦 Stok Sparepart Gudang
            </h1>
            <div className="text-sm text-gray-500 mt-1">
              Menampilkan {filteredInventory.length} dari {inventory.length}{" "}
              barang
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Cari nama part, kategori, atau rak..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
              <tr>
                <th className="p-4 border-b">Part name</th>
                <th className="p-4 border-b">Location</th>
                <th className="p-4 border-b text-center">Stock</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 border-b">
                    <td className="p-4">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.category}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono border border-gray-300">
                        {item.location}
                      </span>
                    </td>
                    <td
                      className={`p-4 text-center font-bold ${
                        item.stock <= item.minStock
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.stock}{" "}
                      <span className="text-xs text-gray-400 font-normal">
                        {item.unit}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.stock <= item.minStock
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.stock <= item.minStock ? "Order Now!" : "Aman"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleClickPinjam(item)}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm transition shadow-sm"
                      >
                        Pinjam
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Barang "{searchTerm}" tidak ditemukan. 🤔
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Pinjam:{" "}
              <span className="text-indigo-600">{selectedItem?.name}</span>
            </h2>

            <form onSubmit={handleSubmitPinjam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Peminjam
                </label>
                {/* 4. INPUT INI KITA DISABLE SUPAYA GAK BISA DIGANTI */}
                <input
                  required
                  name="borrower"
                  value={formData.borrower}
                  readOnly // <-- Gak bisa diedit manual
                  className="w-full bg-gray-100 text-gray-500 border border-gray-300 rounded-lg p-2 focus:outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Untuk Mesin
                </label>
                <input
                  required
                  name="machine"
                  value={formData.machine}
                  onChange={handleInputChange}
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alasan
                </label>
                <textarea
                  required
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
