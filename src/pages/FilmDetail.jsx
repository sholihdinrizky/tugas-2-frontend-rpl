import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function FilmDetail() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Menembak API detail film berdasarkan ID yang ada di URL
    api
      .get(`/films/${id}`)
      .then((res) => {
        setFilm(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-900 text-white p-10 text-center animate-pulse text-xl">
        Memuat detail film...
      </div>
    );
  if (!film)
    return (
      <div className="min-h-screen bg-slate-900 text-white p-10 text-center text-red-400">
        Film tidak ditemukan.
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-10">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 mt-8 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
        <h1 className="text-4xl font-bold text-blue-400">{film.title}</h1>

        <div className="flex gap-3 mt-4">
          <span className="bg-slate-700 px-3 py-1 rounded text-sm font-semibold text-slate-300">
            {film.airing_status === "finished_airing"
              ? "Selesai Tayang"
              : "Sedang Tayang"}
          </span>
          <span className="bg-slate-700 px-3 py-1 rounded text-sm font-semibold text-yellow-400">
            ⭐ {film.rating ? film.rating.toFixed(1) : "Belum ada rating"}
          </span>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-bold border-b border-slate-700 pb-2 mb-3">
            Sinopsis
          </h3>
          <p className="text-slate-300 leading-relaxed">
            {film.synopsis || "Tidak ada sinopsis."}
          </p>
        </div>

        {/* Nanti form Review & Tombol tambah Watchlist kita taruh di bawah sini */}
        <div className="mt-10 p-4 border border-slate-700 rounded-lg bg-slate-800/50">
          <p className="text-center text-slate-400 text-sm">
            Area Review & Interaksi akan dipasang di sini
          </p>
        </div>
      </div>
    </div>
  );
}
