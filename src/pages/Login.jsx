import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(""); // Reset error sebelumnya

    try {
      // Menembak API Login
      const response = await axios.post(
        "https://film-management-api.labse.id/api/v1/auth/login",
        {
          email: email,
          password: password,
        },
      );

      // Mengambil token dari response server (biasanya ada di response.data.token atau response.data.data.token)
      const token = response.data.data?.token || response.data.token;

      // Simpan token ke brankas Zustand
      setAuth(token, null);

      alert("Login Berhasil!");
      navigate("/"); // Lempar user kembali ke halaman Home
    } catch (error) {
      // Menampilkan pesan error dari server jika gagal
      setErrorMsg(
        error.response?.data?.message || "Terjadi kesalahan saat login.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-lg bg-slate-800 p-8 shadow-lg border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Login Sistem
        </h2>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full rounded-md bg-slate-700 border-none text-white p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="atmin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-md bg-slate-700 border-none text-white p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full rounded-md py-2 font-semibold text-white transition-colors ${
              isLoading
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {isLoading ? "Memproses..." : "Masuk Sekarang"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
