"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleLogin } from "@react-oauth/google";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/"); // or "/todo" if you moved it
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
   <form onSubmit={handleLogin} className="flex flex-col gap-4">
  <Input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  <Input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <Button type="submit">Login</Button>

  <div className="my-4 text-center">or</div>

  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      try {
        const res = await fetch("http://localhost:3001/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: credentialResponse.credential }),

        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          router.push("/");
        } else {
          alert(data.message || "Google login failed");
        }
      } catch (err) {
        console.error(err);
        alert("Google login error");
      }
    }}
    onError={() => {
      alert("Google Login Failed");
    }}
  />
</form>

  );
}
