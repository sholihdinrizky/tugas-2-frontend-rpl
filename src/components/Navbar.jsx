import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../api";

export default function Navbar() {
  const { token, user, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();

  // Otomatis mengambil data profil (Get Me) jika ada token tapi belum ada data user
  useEffect(() => {
    if (token && !user) {
      api
        .get("/auth/me")
        .then((res) => setAuth(token, res.data.data))
        .catch(() => logout()); // Tendang kalau token kadaluarsa
    }
  }, [token, user, setAuth, logout]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800 p-4 text-white flex justify-between items-center shadow-md sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-blue-400">
        RPL Films 🍿
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Halo, {user.username}</span>
            {/* Tombol Admin Panel hanya muncul kalau yang login adalah admin */}
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="text-xs bg-purple-600 px-3 py-1.5 rounded hover:bg-purple-500 font-bold"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1.5 rounded hover:bg-red-500 text-sm font-bold"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="gap-3 flex">
            <Link
              to="/login"
              className="bg-blue-600 px-4 py-1.5 rounded hover:bg-blue-500 text-sm font-bold"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-slate-700 px-4 py-1.5 rounded border border-slate-600 hover:bg-slate-600 text-sm font-bold"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
