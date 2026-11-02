import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50 text-stone-800">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-black text-rose-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-stone-600 mb-6 text-sm">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-800 text-white font-semibold hover:bg-rose-900 transition-colors shadow-sm"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
