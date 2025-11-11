"use client";

import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const handleSignout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login"); // redirect to login after logout
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      <h1>Welcome</h1>
      <button className="btn" onClick={handleSignout}>Sign out</button>
    </>
  );
};

export default Home;
