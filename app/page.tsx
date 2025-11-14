"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ExpensesPage from './components/ExpensesPage';
import Modal from "./components/Modal";

const Home = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  const handleSignout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    router.push("/login");
    setModalOpen(false);
  };

  return (
    <>
      <header className="bg-color-4 w-full flex items-center justify-center h-12 sticky top-0 z-50">
        <nav className="flex items-center justify-between px-5 max-w-6xl w-full">
          <p className="text-white font-bold">Logo</p>
          <div className="flex gap-2 items-center">
            <p className="text-white">{email}</p>
            <button onClick={() => setModalOpen(true)} className="btn">Sign Out</button>
          </div>
        </nav>
      </header>
      <ExpensesPage />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="bg-white flex flex-col items-center justify-center gap-2">
          Are you sure to sign out?
          <button onClick={handleSignout} className="btn">Sign Out</button>
        </div>
      </Modal>
    </>
  );
};

export default Home;
