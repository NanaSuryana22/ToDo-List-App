"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMail, IoLockClosed, IoPerson } from "react-icons/io5";
import "./auth.css";

type User = { id: string; fullName: string; email: string };
type Todo = { id: string; text: string };

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);

  // State untuk kontrol animasi slide form
  const [isRegisterActive, setIsRegisterActive] = useState(false);

  // Form States (Terpisah untuk Login dan Register agar tidak bentrok)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [todoText, setTodoText] = useState("");

  // Fetch API Todos saat user sudah login
  useEffect(() => {
    if (user) {
      fetch(`/api/todos?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => setTodos(data));
    }
  }, [user]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm),
    });

    if (res.ok) {
      const userData = await res.json();
      setTodos([]); // Kosongkan list lokal sebelum memuat data user baru
      setUser(userData);
    } else {
      alert("Gagal login, periksa kembali email dan password kamu.");
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerForm),
    });

    if (res.ok) {
      const userData = await res.json();
      setTodos([]); // Kosongkan list untuk user baru
      setUser(userData);
    } else {
      alert("Gagal registrasi.");
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoText.trim()) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id, text: todoText }),
    });

    if (res.ok) {
      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setTodoText("");
    }
  };

  const deleteTodo = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTodos(todos.filter((t) => t.id !== id));
    }
  };

  // ==========================================
  // TAMPILAN JIKA BELUM LOGIN (AUTH FORM)
  // ==========================================
  if (!user) {
    return (
      <div className="auth-container">
        <div className={`wrapper ${isRegisterActive ? "active" : ""}`}>
          <img src="/img.svg" alt="Decoration" />
          <h2 className="text-right">Welcome</h2>

          {/* FORM LOGIN */}
          <div className="form-wrapper login">
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              <div className="input-box">
                <span className="icon">
                  <IoMail />
                </span>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                />
              </div>
              <div className="input-box">
                <span className="icon">
                  <IoLockClosed />
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                />
              </div>
              <div className="forgot-pass">
                <a href="#">Forgot Password?</a>
              </div>
              <button type="submit">Login</button>
              <div className="sign-link">
                <p>
                  Don't have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsRegisterActive(true);
                    }}
                  >
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* FORM REGISTER */}
          <div className="form-wrapper register">
            <form onSubmit={handleRegister}>
              <h2>Registration</h2>
              <div className="input-box">
                <span className="icon">
                  <IoPerson />
                </span>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={registerForm.fullName}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      fullName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="input-box">
                <span className="icon">
                  <IoMail />
                </span>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                />
              </div>
              <div className="input-box">
                <span className="icon">
                  <IoLockClosed />
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <button type="submit">Register</button>
              <div className="sign-link">
                <p>
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsRegisterActive(false);
                    }}
                  >
                    Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN JIKA SUDAH LOGIN (TODO LIST APP)
  // ==========================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] py-10 px-4 font-['Poppins',sans-serif]">
      <div className="w-full max-w-3xl bg-white rounded-[40px] shadow-[0_0_60px_rgba(0,0,0,0.1)] p-8 md:p-12 relative overflow-hidden">
        {/* Aksen Gradasi Hijau */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#54880e] to-[#f2f2f2]"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            {/* Sapaan sekarang konsisten menggunakan Full Name */}
            <h1 className="text-3xl font-bold text-[#54880e]">
              Halo, {user.fullName}!
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Apa fokus utamamu hari ini?
            </p>
          </div>
          <button
            onClick={() => setUser(null)}
            className="bg-red-50 text-red-500 px-5 py-2 rounded-full font-medium hover:bg-red-500 hover:text-white transition-colors duration-300"
          >
            Logout
          </button>
        </div>

        <form
          onSubmit={addTodo}
          className="flex flex-col md:flex-row gap-3 mb-10"
        >
          <input
            type="text"
            placeholder="Tambahkan tugas baru..."
            className="flex-1 px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#54880e] focus:bg-white rounded-full outline-none transition-all text-gray-700 shadow-inner"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#54880e] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#426b0a] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Tambah
          </button>
        </form>

        <ul className="space-y-4">
          <AnimatePresence>
            {todos.map((todo) => (
              <motion.li
                key={todo.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex justify-between items-center p-5 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow group"
              >
                <span className="text-gray-700 font-medium text-lg">
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-300"
                >
                  Hapus
                </button>
              </motion.li>
            ))}
          </AnimatePresence>

          {todos.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 mt-8 py-12 border-2 border-dashed border-gray-200 rounded-[30px]"
            >
              Belum ada tugas. Yuk, mulai produktif!
            </motion.p>
          )}
        </ul>
      </div>
    </div>
  );
}
