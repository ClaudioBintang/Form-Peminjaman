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
  {
    id: 9,
    name: "Thermal Imager",
    category: "Thermal",
    stock: 1,
    location: "Rak A-09",
    spec: "FLUX, Class A",
    status: "Available",
  },
  {
    id: 10,
    name: "Walkie Talkie",
    category: "Communication",
    stock: 1,
    location: "Rak A-10",
    spec: "HT Motorola, Class A",
    status: "Available",
  },
  {
    id: 11,
    name: "JIG & PUNCH SET",
    category: "Mechanical",
    stock: 1,
    location: "Rak A-11",
    spec: "Standard, Class A",
    status: "Available",
  },
  {
    id: 12,
    name: "Vernier Caliper 300mm",
    category: "Mechanical",
    stock: 2,
    location: "Rak A-12",
    spec: "IEC 60751, Class B",
    status: "Available",
  },
  {
    id: 13,
    name: "Vernier Caliper 150mm",
    category: "Mechanical",
    stock: 1,
    location: "Rak A-13",
    spec: "IEC 60751, Class B",
    status: "Available",
  },
  {
    id: 14,
    name: "Hardnest Tester",
    category: "Mechanical",
    stock: 2,
    location: "Rak A-14",
    spec: "IEC 60751, Class B",
    status: "Available",
  },
  {
    id: 15,
    name: "Digital Multimeter",
    category: "Sensors",
    stock: 1,
    location: "Rak A-15",
    spec: "IEC 60751, Class B",
    status: "Available",
  },
  {
    id: 16,
    name: "Yokogawa Instrument",
    category: "Electrical",
    stock: 1,
    location: "Rak A-16",
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
    status: "Returned",
  },
];
