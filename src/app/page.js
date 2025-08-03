"use client"; // important for using `useEffect` and `localStorage`

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Todo from "./Todo";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login page if not authenticated
      router.push("/login");
    } else {
      setIsAuthenticated(true); // Allow access
    }
  }, []);

  if (!isAuthenticated) return null; // Or you can show a loader

  return <Todo />;
}

