import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../api";

export default function Navbar() {
  const { token, user, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !user?.username) {
      try {
        // Kita bedah Token JWT-nya paksa pakai alat bawaan browser buat dapetin ID user
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));

        // Ambil ID dari dalam token
        const userId = payload.id || payload.sub || payload.user_id;

        // Tembak API yang KITA TAHU PASTI ADA dari Postman temanmu
        if (userId) {
          api
            .get(`/users/${userId}`)
            .then((res) => setAuth(token, res.data.data))
            .catch((err) => console.log("Gagal narik nama", err)); // Sekarang kalau gagal, kita ga akan auto-logout!
        } else {
          setAuth(token, payload); // Backup plan
        }
      } catch (error) {
        console.error("Gagal baca token", error);
      }
    }
  }, [token, user, setAuth]);

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
        {user && user.username ? (
          <div className="flex items-center gap-4">
            <Link
              to={"/users/" + user.id}
              className="text-sm font-medium text-blue-300 hover:underline"
            >
              Halo, {user.username}
            </Link>
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
