import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FilmDetail from "./pages/FilmDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/users/:id" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/film/:id" element={<FilmDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
