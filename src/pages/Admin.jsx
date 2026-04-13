import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Admin() {
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");
  const [filmData, setFilmData] = useState({
    title: "",
    synopsis: "",
    release_date: "",
    total_episodes: 1,
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  // GET: Mengambil data genre untuk tabel
  const fetchGenres = () => {
    api
      .get("/genres/admin?take=10&page=1")
      .then((res) => setGenres(res.data.data.data || res.data.data))
      .catch((err) => console.error("Gagal ambil genre:", err));
  };

  // POST: Menambah Genre
  const handleAddGenre = async (e) => {
    e.preventDefault();
    try {
      await api.post("/genres", { name: newGenre });
      alert("Genre berhasil ditambah!");
      setNewGenre("");
      fetchGenres(); // Refresh tabel setelah nambah
    } catch (err) {
      alert("Gagal tambah genre, cek console");
    }
  };

  // POST: Menambah Film Baru (Sesuai Postman pakai FormData)
  const handleAddFilm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", filmData.title);
    formData.append("synopsis", filmData.synopsis);
    formData.append("airing_status", "finished_airing");
    formData.append("total_episodes", filmData.total_episodes);
    // Format tanggal yang diminta API: YYYY-MM-DD HH:mm:ss
    const formattedDate = filmData.release_date.replace("T", " ") + ":00";
    formData.append("release_date", formattedDate);

    try {
      await api.post("/films", formData);
      alert("Film berhasil ditambahkan ke Katalog!");
      setFilmData({
        title: "",
        synopsis: "",
        release_date: "",
        total_episodes: 1,
      });
    } catch (err) {
      alert("Gagal tambah film. Pastikan kamu login sebagai Admin.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-10">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-bold text-purple-400 border-b border-slate-700 pb-4 mb-8">
          Dashboard Admin
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Panel Tambah Genre */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">
              Tambah Kategori/Genre
            </h2>
            <form onSubmit={handleAddGenre} className="flex gap-2">
              <input
                type="text"
                required
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                className="flex-1 bg-slate-700 rounded p-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Nama genre baru..."
              />
              <button
                type="submit"
                className="bg-purple-600 px-4 py-2 rounded font-bold hover:bg-purple-500"
              >
                Tambah
              </button>
            </form>

            <h3 className="text-lg font-bold mt-8 mb-3">Tabel Daftar Genre</h3>
            <div className="bg-slate-700 rounded overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-600">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nama Genre</th>
                  </tr>
                </thead>
                <tbody>
                  {genres && genres.length > 0 ? (
                    genres.map((g) => (
                      <tr key={g.id} className="border-t border-slate-600">
                        <td
                          className="p-3 truncate max-w-[100px] text-slate-400"
                          title={g.id}
                        >
                          {g.id.substring(0, 8)}...
                        </td>
                        <td className="p-3 font-medium">{g.name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="p-3 text-center text-slate-400"
                      >
                        Belum ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel Tambah Film */}
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg h-fit">
            <h2 className="text-xl font-bold mb-4 text-white">
              Upload Film Baru
            </h2>
            <form onSubmit={handleAddFilm} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-slate-300">
                  Judul Film
                </label>
                <input
                  type="text"
                  required
                  value={filmData.title}
                  onChange={(e) =>
                    setFilmData({ ...filmData, title: e.target.value })
                  }
                  className="w-full bg-slate-700 rounded p-2 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-slate-300">
                  Sinopsis
                </label>
                <textarea
                  required
                  value={filmData.synopsis}
                  onChange={(e) =>
                    setFilmData({ ...filmData, synopsis: e.target.value })
                  }
                  className="w-full bg-slate-700 rounded p-2 outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm mb-1 text-slate-300">
                    Tanggal Rilis
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={filmData.release_date}
                    onChange={(e) =>
                      setFilmData({ ...filmData, release_date: e.target.value })
                    }
                    className="w-full bg-slate-700 rounded p-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm mb-1 text-slate-300">
                    Episode
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={filmData.total_episodes}
                    onChange={(e) =>
                      setFilmData({
                        ...filmData,
                        total_episodes: e.target.value,
                      })
                    }
                    className="w-full bg-slate-700 rounded p-2 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 py-3 rounded font-bold hover:bg-purple-500 mt-4 transition-colors"
              >
                Posting Film
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
