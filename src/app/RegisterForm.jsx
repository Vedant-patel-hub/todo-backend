"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();

    if (res.ok) {
      setMessage("✅ Registered! Now log in.");
    } else {
      setMessage("❌ " + json.message);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 gap-4">
      <h2 className="text-2xl font-bold">Register</h2>

      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-64">
        <input
          placeholder="Email"
          value={email}
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          value={password}
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Register
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
