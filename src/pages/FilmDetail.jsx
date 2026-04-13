import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";
import { useAuthStore } from "../store/authStore";

export default function FilmDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [film, setFilm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewData, setReviewData] = useState({ rating: 10, comment: "" });

  // Fungsi untuk menarik data film + review dari server
  const fetchFilmDetail = () => {
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
  };

  useEffect(() => {
    fetchFilmDetail();
  }, [id]);

  // Fitur 1: Tambah ke Watchlist
  const handleAddWatchlist = async () => {
    if (!user) return alert("Login dulu ya buat nambah watchlist!");
    try {
      await api.post("/film-lists", { film_id: id, list_status: "watching" });
      alert("Berhasil ditambahkan ke Watchlist!");
    } catch (err) {
      alert("Gagal. Mungkin film ini sudah ada di watchlist-mu.");
    }
  };

  // Fitur 2: Kirim Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login dulu buat kasih ulasan!");
    try {
      await api.post("/reviews", {
        film_id: id,
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
      });
      alert("Ulasan berhasil dikirim!");
      setReviewData({ rating: 10, comment: "" }); // Kosongkan form
      fetchFilmDetail(); // Refresh data biar review-nya langsung muncul
    } catch (err) {
      alert(
        "Gagal kirim ulasan. Cek apakah kamu sudah pernah review film ini.",
      );
    }
  };

  // Fitur 3: Kasih Reaction (Like/Dislike)
  const handleReaction = async (reviewId, status) => {
    if (!user) return alert("Login dulu buat ngasih reaction!");
    try {
      await api.post("/reactions", { review_id: reviewId, status: status });
      fetchFilmDetail(); // Refresh data biar angka like/dislike nambah
    } catch (err) {
      alert(
        "Kamu cuma bisa ngasih 1 reaksi per ulasan (atau coba lagi nanti).",
      );
    }
  };

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
        {/* Header Info & Gambar */}
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={
              film.images && film.images.length > 0
                ? `https://film-management-api.labse.id/api/static/${film.images[0].image_path}`
                : "https://placehold.co/300x450/1e293b/a9bcc8?text=No+Image"
            }
            alt={film.title}
            className="w-full md:w-64 h-96 object-cover rounded-lg shadow-md border border-slate-700"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-blue-400">{film.title}</h1>

            <div className="flex flex-wrap gap-3 mt-4 mb-6">
              <span className="bg-slate-700 px-3 py-1 rounded text-sm font-semibold">
                {film.airing_status === "finished_airing"
                  ? "Selesai Tayang"
                  : "Sedang Tayang"}
              </span>
              <span className="bg-slate-700 px-3 py-1 rounded text-sm font-semibold text-yellow-400">
                ⭐ {film.rating ? film.rating.toFixed(1) : "Belum ada rating"}
              </span>
            </div>

            <button
              onClick={handleAddWatchlist}
              className="bg-green-600 hover:bg-green-500 px-5 py-2.5 rounded font-bold shadow-lg transition-colors w-full md:w-auto mb-6"
            >
              + Tambah ke Watchlist
            </button>

            <div>
              <h3 className="text-xl font-bold border-b border-slate-700 pb-2 mb-3">
                Sinopsis
              </h3>
              <p className="text-slate-300 leading-relaxed text-justify">
                {film.synopsis || "Tidak ada sinopsis."}
              </p>
            </div>
          </div>
        </div>

        {/* Area Review */}
        <div className="mt-12 border-t border-slate-700 pt-8">
          <h3 className="text-2xl font-bold mb-6 text-white">
            Ulasan Penonton
          </h3>

          {/* Form Nulis Review */}
          <form
            onSubmit={handleReviewSubmit}
            className="bg-slate-700/50 p-5 rounded-lg mb-8 border border-slate-600"
          >
            <h4 className="font-semibold mb-4 text-blue-300">Tulis Ulasanmu</h4>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full md:w-32">
                <label className="block text-sm mb-1 text-slate-300">
                  Rating (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={reviewData.rating}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, rating: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1 text-slate-300">
                  Komentar
                </label>
                <input
                  type="text"
                  required
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none focus:border-blue-500"
                  placeholder="Wah filmnya keren banget..."
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-bold w-full md:w-auto transition-colors"
            >
              Kirim Ulasan
            </button>
          </form>

          {/* Daftar Review Orang-orang */}
          <div className="space-y-4">
            {film.reviews && film.reviews.length > 0 ? (
              film.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-slate-800 p-5 rounded-lg border border-slate-700 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3 border-b border-slate-700 pb-3">
                    {/* Sesuai update mas Andrew, username sekarang udah ikut direturn */}
                    <span className="font-bold text-blue-400">
                      @{rev.user?.username || "user_anonim"}
                    </span>
                    <span className="bg-yellow-500/20 text-yellow-400 font-bold px-2 py-1 rounded text-sm">
                      ⭐ {rev.rating}/10
                    </span>
                  </div>
                  <p className="text-slate-300 mb-4">{rev.comment}</p>

                  {/* Tombol Reaction */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReaction(rev.id, "like")}
                      className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded font-semibold text-slate-300 transition-colors"
                    >
                      👍 Like ({rev.likes || 0})
                    </button>
                    <button
                      onClick={() => handleReaction(rev.id, "dislike")}
                      className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded font-semibold text-slate-300 transition-colors"
                    >
                      👎 Dislike ({rev.dislikes || 0})
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-slate-800 rounded-lg border border-slate-700 border-dashed">
                <p className="text-slate-400">
                  Belum ada ulasan. Jadilah yang pertama berkomentar!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
