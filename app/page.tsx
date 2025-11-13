"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Expenses from "./ui/expenses";

const Home = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });

        if (!res.ok) {
          console.warn("User not authenticated");
          setEmail(null);
          return;
        }

        const data = await res.json();
        setEmail(data.email);
      } catch (err) {
        console.error("Error fetching user:", err);
        setEmail(null);
      }
    };

    fetchUser();
  }, []);

  const handleSignout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  };

  const queryClient = new QueryClient();

  return (
    <>
      <header className="bg-color-4 w-full items-center justify-center h-12 flex">
        <nav className="flex items-center justify-between px-5 max-w-6xl w-full">
          <p className="text-white font-bold">Logo</p>
          <div className="flex gap-2 items-center">
            <p className="text-white">{email}</p>
            <button onClick={handleSignout} className="btn">Sign Out</button>
          </div>
        </nav>
      </header>
      <QueryClientProvider client={queryClient}>
        <Expenses />
      </QueryClientProvider>
    </>
  );
};

export default Home;
