import { RentalTransaction } from "@/types";

/**
 * Ekspor data transaksi sewa TRIVA Outdoor ke format spreadsheet Excel (.csv ber-BOM UTF-8)
 * Kompatibel langsung dibuka di Microsoft Excel, Google Sheets, dan LibreOffice tanpa error encoding.
 */
export function exportRentalsToExcel(
  rentals: RentalTransaction[],
  periodLabel: string = "Semua_Transaksi"
) {
  if (rentals.length === 0) {
    alert("Tidak ada data transaksi yang dapat diekspor.");
    return;
  }

  const headers = [
    "No",
    "Kode Booking",
    "Tanggal Transaksi",
    "Nama Penyewa",
    "No WhatsApp",
    "Jenis Jaminan",
    "Jadwal Mulai",
    "Jadwal Selesai",
    "Durasi (Hari)",
    "Daftar Perlengkapan Disewa",
    "Total Omset (Rp)",
    "DP Kas Masuk (Rp)",
    "Sisa Bayar di Toko (Rp)",
    "Metode Pembayaran",
    "Status Sewa",
    "Petugas Kasir",
    "Catatan"
  ];

  const getStatusLabel = (status: RentalTransaction["status"]) => {
    switch (status) {
      case "pending_dp":
        return "Menunggu Verifikasi DP";
      case "confirmed":
        return "Siap Diambil di Toko";
      case "active":
        return "Sedang Digunakan";
      case "returned":
        return "Selesai (Kembali)";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const rows = rentals.map((r, idx) => {
    const itemsList = r.items.map((i) => `${i.unitCode} - ${i.name} (${i.qty}x)`).join("; ");
    const cleanDate = r.createdAt ? r.createdAt.slice(0, 10) : r.startDate;
    return [
      idx + 1,
      `"${r.bookingCode}"`,
      `"${cleanDate}"`,
      `"${r.customerName.replace(/"/g, '""')}"`,
      `"'${r.customerPhone}"`, // petik satu agar Excel mempertahankan angka 0 di depan
      `"${r.idCardType}"`,
      `"${r.startDate}"`,
      `"${r.endDate}"`,
      r.durationDays,
      `"${itemsList.replace(/"/g, '""')}"`,
      r.totalAmount,
      r.downPayment,
      r.remainingAmount,
      `"${r.paymentMethod.toUpperCase()}"`,
      `"${getStatusLabel(r.status)}"`,
      `"${(r.handledByStaffName || "-").replace(/"/g, '""')}"`,
      `"${(r.notes || "-").replace(/"/g, '""')}"`
    ];
  });

  const totalOmset = rentals.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalDp = rentals.reduce((sum, r) => sum + r.downPayment, 0);
  const totalRemaining = rentals.reduce((sum, r) => sum + r.remainingAmount, 0);

  const summaryRow = [
    "",
    "TOTAL",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    `"${rentals.length} Transaksi"`,
    totalOmset,
    totalDp,
    totalRemaining,
    "",
    "",
    "",
    ""
  ];

  // \uFEFF adalah UTF-8 Byte Order Mark agar Microsoft Excel di Windows membuka karakter Indonesia & angka desimal dengan benar
  const csvContent = "\uFEFF" + [
    headers.join(","),
    ...rows.map((e) => e.join(",")),
    summaryRow.join(",")
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const cleanPeriod = periodLabel.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `TRIVA_Laporan_Sewa_${cleanPeriod}.csv`;

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
