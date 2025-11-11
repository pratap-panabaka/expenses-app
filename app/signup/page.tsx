"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Signing up:", email);

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setEmail("");
                setPassword("");
                setError(null);
                router.push("/");
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <main className="p-2 h-[100vh] bg-color-1 flex flex-col items-center justify-center">
            <h1 className="text-14 sm:text-18 md:text-24 lg:text-28 text-color-4">
                Expenses & Contacts App
            </h1>
            <form
                className="max-w-2xl bg-color-2 p-4 gap-4 mt-6 w-full flex flex-col rounded-lg items-center"
                onSubmit={handleSubmit}
            >
                <input
                    className="form-input"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
                <input
                    className="form-input"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    minLength={2}
                    required
                />
                <button type="submit" className="btn">Sign Up</button>
                {error && <p className="text-color-4">{error}</p>}
            </form>
        </main>
    );
};

export default Page;
