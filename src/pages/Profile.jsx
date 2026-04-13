import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";
import { useAuthStore } from "../store/authStore";

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuthStore(); // Ambil data user yang lagi login
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = () => {
    api
      .get(`/users/${id}`)
      .then((res) => {
        setProfile(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  // Fitur mengubah visibilitas (Public / Private)
  const handleToggleVisibility = async (listId, currentVisibility) => {
    const newVisibility = currentVisibility === "public" ? "private" : "public";
    try {
      await api.patch(`/film-lists/${listId}`, { visibility: newVisibility });
      fetchProfile(); // Refresh data biar statusnya langsung berubah di layar
    } catch (err) {
      alert("Gagal merubah visibilitas!");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-900 text-white p-10 text-center animate-pulse text-xl">
        Memuat profil...
      </div>
    );
  if (!profile)
    return (
      <div className="min-h-screen bg-slate-900 text-white p-10 text-center text-red-400">
        User tidak ditemukan.
      </div>
    );

  // Cek apakah profil yang sedang dilihat adalah milik user yang sedang login
  const isOwner = user && user.id === profile.id;

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-10">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-8">
        {/* Header Profil */}
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 mb-8 flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl font-bold uppercase shadow-inner">
            {profile.username.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {profile.display_name}
            </h1>
            <p className="text-blue-400 font-medium mb-2">
              @{profile.username}
            </p>
            <p className="text-slate-300 italic">
              "{profile.bio || "Tidak ada bio"}"
            </p>
          </div>
        </div>

        {/* Daftar Tontonan (Watchlist) */}
        <h2 className="text-2xl font-bold border-b border-slate-700 pb-2 mb-4 text-white">
          Daftar Tontonan (Watchlist)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.film_lists && profile.film_lists.length > 0 ? (
            profile.film_lists.map((list) => (
              <div
                key={list.id}
                className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center shadow-sm hover:border-slate-500 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-lg text-blue-300 truncate max-w-[200px]">
                    {list.film_title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 capitalize">
                    Status:{" "}
                    <span className="text-white font-medium">
                      {list.list_status}
                    </span>
                  </p>
                  <p
                    className={`text-xs mt-1 font-bold ${list.visibility === "public" ? "text-green-400" : "text-red-400"}`}
                  >
                    {list.visibility.toUpperCase()}
                  </p>
                </div>

                {/* Tombol ubah private/public HANYA muncul kalau yang buka adalah pemilik profilnya */}
                {isOwner && (
                  <button
                    onClick={() =>
                      handleToggleVisibility(list.id, list.visibility)
                    }
                    className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-sm font-semibold transition-colors border border-slate-600"
                  >
                    Ubah ke{" "}
                    {list.visibility === "public" ? "Private" : "Public"}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-400 col-span-2 text-center py-6 bg-slate-800 rounded-lg border border-dashed border-slate-700">
              Belum ada daftar tontonan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
