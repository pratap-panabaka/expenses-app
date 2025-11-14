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
    const [amt, setAmt] = useState(amount);
    const [desc, setDesc] = useState(description);

    const editMutation = useEditExpense(id);

    const submit = (e: FormEvent) => {
        e.preventDefault();

        editMutation.mutate(
            { amt, desc },
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
                value={amt}
                onChange={(e) => setAmt(Number(e.target.value))}
                required
            />

            <input
                className="form-input"
                type="text"
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
