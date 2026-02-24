import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const InventoryTable = ({
  inventory,
  onTransaction, // Gunakan ini untuk Pinjam
  onAddItem,     // Gunakan ini untuk Tambah Barang Baru
}) => {
  const { user } = useAuth();

  // State Modal & Search
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form Data
  const [formData, setFormData] = useState({ borrower: "", machine: "", reason: "" });
  const [newItemData, setNewItemData] = useState({
    name: "",
    category: "",
    location: "",
    stock: 0,
    min_stock: 0, // Sesuai kolom database
    unit: "Pcs",
  });

  // --- LOGIC SEARCH ---
  const filteredInventory = inventory.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // --- LOGIC PINJAM ---
  const handleClickPinjam = (item) => {
    if (item.stock <= 0) {
      alert("Stok habis! Tidak bisa dipinjam.");
      return;
    }
    setSelectedItem(item);
    // Menggunakan user.username atau user.name sesuai context kamu
    setFormData({ borrower: user.username || user.name, machine: "", reason: "" });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // REVISI BAGIAN INI: Sekarang lari ke Supabase lewat App.jsx
  const handleSubmitPinjam = (e) => {
    e.preventDefault();

    const itemToUpdate = { 
      ...selectedItem, 
      stock: selectedItem.stock - 1 
    };

    const newLogData = {
      borrower: formData.borrower,
      machine: formData.machine,
      reason: formData.reason,
    };

    // Panggil fungsi sakti dari App.jsx
    onTransaction(itemToUpdate, newLogData);

    setIsModalOpen(false);
    // Reset form
    setFormData({ borrower: user.username || user.name, machine: "", reason: "" });
  };

  // --- LOGIC TAMBAH BARANG BARU ---
  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewItem = (e) => {
    e.preventDefault();
    const finalItem = {
      ...newItemData,
      stock: parseInt(newItemData.stock),
      min_stock: parseInt(newItemData.min_stock), // Pastikan snake_case
    };

    onAddItem(finalItem); 
    setIsAddModalOpen(false);
    setNewItemData({ name: "", category: "", location: "", stock: 0, min_stock: 0, unit: "Pcs" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📦 Stok Sparepart Gudang</h1>
            <div className="text-sm text-gray-500 mt-1">
              Menampilkan {filteredInventory.length} dari {inventory.length} barang
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Cari part..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>

            {user.role === "admin" && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition"
              >
                <span>+</span> Tambah Barang
              </button>
            )}
          </div>
        </div>

        {/* Tabel Inventory */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 overflow-x-auto">
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
                      <div className="font-bold text-gray-800">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.category}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono border border-gray-300">
                        {item.location}
                      </span>
                    </td>
                    <td className={`p-4 text-center font-bold ${item.stock <= (item.min_stock || item.minStock) ? "text-red-600" : "text-green-600"}`}>
                      {item.stock} <span className="text-xs text-gray-400 font-normal">{item.unit}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.stock <= (item.min_stock || item.minStock) ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {item.stock <= (item.min_stock || item.minStock) ? "Order Now!" : "Aman"}
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
                  <td colSpan="5" className="p-8 text-center text-gray-500">Barang tidak ditemukan. 🤔</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL PINJAM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Pinjam: <span className="text-indigo-600">{selectedItem?.name}</span>
            </h2>
            <form onSubmit={handleSubmitPinjam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Peminjam</label>
                <input required name="borrower" value={formData.borrower} readOnly className="w-full bg-gray-100 text-gray-500 border border-gray-300 rounded-lg p-2 outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Untuk Mesin</label>
                <input required name="machine" value={formData.machine} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alasan</label>
                <textarea required name="reason" value={formData.reason} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" rows="3"></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">Batal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">Simpan Transaksi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL TAMBAH BARANG --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">✨ Tambah Barang Baru</h2>
            <form onSubmit={handleSubmitNewItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                <input required name="name" value={newItemData.name} onChange={handleNewItemChange} type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select name="category" value={newItemData.category} onChange={handleNewItemChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                    <option value="">- Pilih -</option>
                    <option value="Sensors">Sensors</option>
                    <option value="Heaters">Heaters</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Pneumatic">Pneumatic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Rak</label>
                  <input required name="location" value={newItemData.location} onChange={handleNewItemChange} type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok Awal</label>
                  <input required name="stock" value={newItemData.stock} onChange={handleNewItemChange} type="number" min="0" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. Stok</label>
                  <input required name="min_stock" value={newItemData.min_stock} onChange={handleNewItemChange} type="number" min="0" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                  <input name="unit" value={newItemData.unit} onChange={handleNewItemChange} type="text" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">Batal</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md">Simpan Barang</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;