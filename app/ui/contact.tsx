"use client";

import { useState } from "react";

const Contact = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        try {
            setLoading(true);

            const formData = new FormData(form);
            const name = formData.get("name") as string;
            const email = formData.get("email") as string;
            const message = formData.get("message") as string;

            const res = await fetch("/api/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            if (!res.ok) throw new Error("Failed to submit form");

            const data = await res.json();
            console.log("Form submitted:", data);

            setSuccess(true);
            form.reset();
        } catch (error) {
            console.error("Form submission error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col justify-center text-center gap-5 min-h-[calc(100vh-4rem)] items-center p-2 bg-color-1">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full gap-5 max-w-2xl bg-color-5 p-5 border-2 border-color-4 rounded-lg"
            >
                <p className="text-20 sm:text-24 lg:text-26 text-color-4">
                    CONTACT ME
                </p>

                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="form-input"
                    autoComplete="off"
                    autoFocus
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    className="form-input"
                    autoComplete="off"
                    required
                />

                <textarea
                    name="message"
                    rows={4}
                    placeholder="Enter your message here..."
                    className="form-input"
                    autoComplete="off"
                    required
                />

                <button
                    type="submit"
                    className="btn"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>

                {success && (
                    <p className="text-green-400 font-bold">Form submitted successfully!</p>
                )}
            </form>
        </main>
    );
};

export default Contact;
