import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-slate-900 text-white">
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-xl">
        <h2 className="text-xl mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="p-2 mb-3 w-full rounded text-black"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 mb-3 w-full rounded text-black"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-blue-600 px-4 py-2 rounded w-full">Login</button>
      </form>
    </div>
  );
};

export default Login;
