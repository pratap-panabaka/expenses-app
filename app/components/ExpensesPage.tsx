"use client";

import { useEffect, useState } from "react";
import { useDeleteExpense } from "../hooks/useDeleteExpense";
import { useExpenses } from "../hooks/useExpense";
import AddForm from "./AddForm";
import EditForm from "./EditForm";
import ExpensesTable from "./ExpensesTable";
import Modal from "./Modal";

export default function ExpensesPage() {
    const { data, isLoading, error } = useExpenses();
    const deleteMutation = useDeleteExpense();

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(false);

    const [selected, setSelected] = useState<{
        id: number;
        amount: number;
        description: string;
    } | null>(null);

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

    const openAdd = () => {
        setEditing(false);
        setSelected(null);
        setModalOpen(true);
    };

    const openEdit = (id: number, amount: number, description: string) => {
        setEditing(true);
        setSelected({ id, amount, description });
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    return (
        <main className="p-4 min-h-[calc(100vh-64px)] bg-color-1">
            <div className="flex items-baseline justify-center gap-5">
                <h1 className="text-2xl font-bold text-color-4">EXPENSES</h1>

                <button onClick={openAdd} className="text-blue-500 cursor-pointer font-bold text-baseline">
                    ADD EXPENSE
                </button>
            </div>

            {isLoading && <p>Loading…</p>}
            {error && <p className="text-red-500">{error.message}</p>}

            {data && (
                <ExpensesTable
                    expenses={data}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                />
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                {!editing ? (
                    <AddForm onClose={() => setModalOpen(false)} />
                ) : (
                    selected && (
                        <EditForm
                            id={selected.id}
                            amount={selected.amount}
                            description={selected.description}
                            onClose={() => setModalOpen(false)}
                        />
                    )
                )}
            </Modal>
        </main>
    );
}
