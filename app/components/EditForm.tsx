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
    amount: number;
    description: string;
    onClose: () => void;
}) {
    // Store as string so the user can clear it without React forcing 0
    const [amt, setAmt] = useState(String(amount));
    const [desc, setDesc] = useState(description);

    const editMutation = useEditExpense(id);

    const submit = (e: FormEvent) => {
        e.preventDefault();

        if (Number(amt) === amount && desc === description) {
            console.log("no change");
            onClose();
            return;
        }

        editMutation.mutate(
            {
                amt: Number(amt), // convert here
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
                type="number"
                placeholder="Amount"
                value={amt}
                onChange={(e) => setAmt(e.target.value)}
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
