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
    const [timeStampVisible, setTimeStampVisible] = useState(false);

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
        <main className="min-h-[calc(100vh-64px)] bg-color-2">
            <div className="sticky top-[64px] z-50 h-[100px] flex flex-col justify-center bg-color-1 items-center">
                <div className="flex items-baseline justify-center gap-5">
                    <h1 className="text-2xl font-bold text-color-4">EXPENSES</h1>
                    <button onClick={openAdd} className="text-blue-500 cursor-pointer font-bold text-baseline">
                        ADD EXPENSE
                    </button>
                    <button
                        className="text-blue-500 cursor-pointer font-bold"
                        onClick={() => setTimeStampVisible(!timeStampVisible)}
                    >
                        {timeStampVisible ? "Hide Time Stamps" : "Show Time Stamps"}
                    </button>
                </div>
                <div className="w-full text-center text-red-500 p-1 text-sm">
                    Please note that this App is just for demo purpose,
                    Even though you are able to sign up and store the data,
                    the database will be cleared regularly.
                </div>
            </div>

            {isLoading && <p className="text-center w-full">Loading…</p>}
            {error && <p className="text-red-500 text-center w-full">{error.message}</p>}

            {data && (
                <ExpensesTable
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    timeStampVisible={timeStampVisible}
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
