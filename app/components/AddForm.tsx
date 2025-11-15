"use client";

import { useState, FormEvent } from "react";
import { useAddExpense } from "../hooks/useAddExpense";

export default function AddForm({ onClose }: { onClose: () => void }) {
    const [amount, setAmount] = useState<number | "">("");
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
        <form className="flex flex-col gap-5" onSubmit={submit}>
            <input
                className="form-input"
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
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
