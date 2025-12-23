"use client";

import { useState, FormEvent } from "react";
import { useAddExpense } from "../hooks/useAddExpense";

export default function AddForm({ onClose }: { onClose: () => void }) {
    const [amount, setAmount] = useState<string>("");
    const [description, setDescription] = useState("");

    const addMutation = useAddExpense();

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (amount === "" || !description) return;

        addMutation.mutate(
            { amount, description },
            {
                onSuccess: () => {
                    setAmount("");
                    setDescription("");
                    onClose();
                },
            }
        );
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={submit} autoComplete="off">
            <input
                className="form-input"
                type="text"
                placeholder="Amount"
                value={amount}
                onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "");
                    setAmount(digitsOnly)
                }}
                required
                autoFocus
                min={0}
            />

            <input
                className="form-input"
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />

            <button type="submit" className="btn" disabled={addMutation.isPending}>
                {addMutation.isPending ? "Adding…" : "Add Expense"}
            </button>

            {addMutation.isError && (
                <p className="text-red-500">{addMutation.error.message}</p>
            )}
        </form>
    );
}
