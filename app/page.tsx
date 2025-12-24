"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ExpensesPage from './components/ExpensesPage';
import Modal from "./components/Modal";
import { VscSignOut } from "react-icons/vsc";
import Image from "next/image";

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
      <header className="bg-color-4 w-full flex items-center justify-center h-[3rem] sticky top-0 z-50">
        <nav className="flex items-center justify-between px-5 max-w-6xl w-full">
          <a href="https://pratap-panabaka.in" target="_blank" rel="noopener noreferrer">
            <Image src="./coder.svg" alt="pratap panababak - dev" width={40} height={40} />
          </a>
          <div className="flex gap-2 items-center">
            <p className="text-white text-lg">{email}</p>
            <button onClick={() => setModalOpen(true)} className="btn"><VscSignOut size={32} /></button>
          </div>
        </nav>
      </header>
      <ExpensesPage />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="bg-white flex flex-col items-center justify-center gap-2 text-xs sm:text-sm md:text-lg">
          Are you sure to sign out?
          <button onClick={handleSignout} className="btn">Sign Out</button>
        </div>
      </Modal>
    </>
  );
};

export default Home;
