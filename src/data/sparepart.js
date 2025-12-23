//1.data inventory
export const initialInventory = [
  {
    id: 1,
    name: "PT100 Sensor",
    category: "Sensors",
    stock: 15,
    location: "Rak A-01",
    spec: "IEC 60751, Class B",
    status: "Available",
  },
  {
    id: 2,
    name: "Thermocouple Type K",
    category: "Sensors",
    stock: 10,
    location: "Rak A-02",
    spec: "IEC 60751, Class B",
    status: "Available",
  },
  {
    id: 3,
    name: "Pressure Transmitter",
    category: "Transmitters",
    stock: 5,
    location: "Rak A-03",
    spec: "IEC 60751, Class B",
    status: "Available",
  },
  {
    id: 4,
    name: "Temperature Transmitter",
    category: "Transmitters",
    stock: 8,
    location: "Rak A-04",
    spec: "IEC 60751, Class B",
    status: "Available",
  },
  {
    id: 5,
    name: "Flow Transmitter",
    category: "Transmitters",
    stock: 12,
    location: "Rak A-05",
    spec: "IEC 60751, Class B",
    status: "Available",
  },
  {
    id: 6,
    name: "Thermal Imager",
    category: "Thermal",
    stock: 1,
    location: "Rak A-06",
    spec: "IEC 60751, Class B",
    status: "Available",
  },
  {
    id: 7,
    name: "DB Meter",
    category: "Sound Level",
    stock: 1,
    location: "Rak A-07",
    spec: "IEC 60751, Class B",
    status: "Available",
  },
  {
    id: 8,
    name: "LUX Meter",
    category: "Sensors Light",
    stock: 1,
    location: "Rak A-08",
    spec: "IEC 60751, Class B",
    status: "Available",
  },
];
//2.data log (for save history peminjaman)
export const initialLogs = [
  {
    id: 101,
    sparepartId: 1, // Mengacu ke PT100 Sensor
    borrower: "Budi (Teknisi)",
    dateBorrowed: "2025-12-10",

    // Data Tambahan Baru
    machine: "Mesin Packing Line 2",
    reason: "Sensor pembacaan error",

    // Status
    dateReturned: null, // Belum dikembalikan (masih dipasang)
    returnCondition: null,
    status: "Borrowed",
  },
  {
    id: 102,
    sparepartId: 3, // Mengacu ke Omron Relay
    borrower: "Andi (Maintenance)",
    dateBorrowed: "2025-12-01",
    
    // Data Tambahan Baru
    machine: "Oven Pemanas 1",
    reason: "Relay macet / lengket",
    
    // Status
    dateReturned: "2025-12-02", // Sudah dikembalikan (bekasnya)
    returnCondition: "Rusak/Scrap", // Kondisi barang bekasnya
    status: "Returned"
  }
];
