"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();

    // useActionState hook for async form handling
    const [error, submitAction, isPending] = useActionState(
        async (_: any, formData: FormData) => {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.get("email"),
                    password: formData.get("password"),
                }),
            });

            const data = await res.json();

            if ("error" in data && typeof data.error === "string") {
                return data.error; // Return the error to show it in the UI
            }

            // Clear inputs and redirect
            setEmail("");
            setPassword("");
            router.push("/");
            return null; // no error
        },
        null
    );

    return (
        <main className="p-2 h-[100vh] bg-color-1 flex flex-col items-center justify-center">
            <h1 className="text-14 sm:text-18 md:text-24 lg:text-28 text-color-4 font-bold">
                Expenses App
            </h1>
            <form
                className="max-w-2xl bg-white p-4 gap-4 mt-6 w-full flex flex-col rounded-lg items-center"
                action={submitAction} // useActionState handles submission
                autoComplete="off"
            >
                <input
                    className="form-input"
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                />
                <input
                    className="form-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={2}
                    required
                />
                <button type="submit" className="btn" disabled={isPending}>
                    {isPending ? "Logging in..." : "Login"}
                </button>
                {error && !isPending && <p className="text-red-500">{error}</p>}
                <p className="text-color-4 flex justify-end w-full">
                    Want to Sign Up?
                    <span>
                        &nbsp;
                        <Link href="/signup" className="text-color-3">
                            Go to Signup Page
                        </Link>
                    </span>
                </p>
            </form>
        </main>
    );
};

export default Page;
