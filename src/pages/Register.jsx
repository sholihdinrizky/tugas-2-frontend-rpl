import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    display_name: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      await axios.post(
        "https://film-management-api.labse.id/api/v1/auth/register",
        formData,
      );
      alert("Register Berhasil! Silakan Login.");
      navigate("/login"); // Lempar ke halaman login setelah sukses
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Terjadi kesalahan saat mendaftar.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-lg bg-slate-800 p-8 shadow-lg border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Daftar Akun Baru
        </h2>

        {errorMsg && (
          <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              className="mt-1 w-full rounded-md bg-slate-700 border-none text-white p-2 focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-md bg-slate-700 border-none text-white p-2 focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full rounded-md bg-slate-700 border-none text-white p-2 focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Display Name
            </label>
            <input
              type="text"
              name="display_name"
              required
              className="mt-1 w-full rounded-md bg-slate-700 border-none text-white p-2 focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              Bio
            </label>
            <textarea
              name="bio"
              rows="2"
              className="mt-1 w-full rounded-md bg-slate-700 border-none text-white p-2 focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            ></textarea>
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
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
