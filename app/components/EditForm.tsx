"use client";

import { useState, FormEvent } from "react";
import { useEditExpense } from "../hooks/useEditExpense";

export default function EditForm({
    id,
    amount,
    description,
    onClose,
}: {
    id: number;
    amount: string;
    description: string;
    onClose: () => void;
}) {
    const [amt, setAmt] = useState(amount);
    const [desc, setDesc] = useState(description);

    const editMutation = useEditExpense(id);

    const submit = (e: FormEvent) => {
        e.preventDefault();

        if (amt === amount && desc === description) {
            onClose();
            return;
        }

        editMutation.mutate(
            {
                amt,
                desc,
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={submit}>
            <input
                className="form-input"
                type="text"
                placeholder="Amount"
                value={amount}
                onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "");
                    setAmt(digitsOnly)
                }}
                required
                autoFocus
                min={0}
            />

            <input
                className="form-input"
                type="text"
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
            />

            <button type="submit" className="btn" disabled={editMutation.isPending}>
                {editMutation.isPending ? "Saving…" : "Update Expense"}
            </button>

            {editMutation.isError && (
                <p className="text-red-500">{editMutation.error.message}</p>
            )}
        </form>
    );
}
