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
        amount: string;
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

    const openEdit = (id: number, amount: string, description: string) => {
        setEditing(true);
        setSelected({ id, amount, description });
        setModalOpen(true);
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    return (
        <main className="min-h-[calc(100vh-(3rem+2rem))] p-2">
            <h1 className="font-bold text-color-4 text-center text-md sm:text-lg md:text-xl">EXPENSES APP</h1>
            <div className="flex flex-col justify-center items-center">
                <div className="w-full text-center text-red-500 p-1 text-xs sm:text-sm md:text-lg">
                    Please note that this App is just for demo purpose,
                    Even though you are able to sign up and store the data,
                    the database will be cleared regularly.
                </div>
                <div className="w-full text-center text-blue-500 p-1 text-xs sm:text-sm md:text-lg">
                    To delete an expense, please double tap the delete icon, there will be no confirmation.
                </div>
                <div className="flex items-baseline justify-center gap-5 text-xs sm:text-sm md:text-lg">
                    <button onClick={openAdd} className="text-blue-500 cursor-pointer font-bold text-baseline">
                        Add Expense
                    </button>
                    <button
                        className="text-blue-500 cursor-pointer font-bold"
                        onClick={() => setTimeStampVisible(!timeStampVisible)}
                    >
                        {timeStampVisible ? "Hide Time Stamps" : "Show Time Stamps"}
                    </button>
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
