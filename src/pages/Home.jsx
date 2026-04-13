import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Home() {
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mengambil data film dari API dengan limit 20 sesuai saran dokumen
    api
      .get("/films?take=20&page=1")
      .then((res) => {
        setFilms(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data film", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-10">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 border-b border-slate-700 pb-4">
          Katalog Film Terbaru
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-xl animate-pulse text-blue-400">
              Memuat film...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {films.map((film) => (
              <Link
                to={`/film/${film.id}`}
                key={film.id}
                className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all group flex flex-col"
              >
                <div className="relative h-64 overflow-hidden bg-slate-700">
                  {/* Memanggil gambar sesuai format dari info kating */}
                  <img
                    src={
                      film.images && film.images.length > 0
                        ? `https://film-management-api.labse.id/api/static/${film.images[0].image_path}`
                        : "https://placehold.co/300x450/1e293b/a9bcc8?text=No+Image"
                    }
                    alt={film.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-bold text-yellow-400">
                    ⭐ {film.rating ? film.rating.toFixed(1) : "N/A"}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h2 className="font-semibold text-base line-clamp-2">
                    {film.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-2 font-medium bg-slate-700 w-fit px-2 py-1 rounded">
                    {film.airing_status === "finished_airing"
                      ? "Selesai"
                      : "Sedang Tayang"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
