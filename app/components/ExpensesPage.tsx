"use client";

import { useEffect, useState } from "react";
import { useDeleteExpense } from "../hooks/useDeleteExpense";
import { useExpenses } from "../hooks/useExpense";
import AddForm from "./AddForm";
import EditForm from "./EditForm";
import ExpensesTable from "./ExpensesTable";
import Modal from "./Modal";
import Image from "next/image";

export default function ExpensesPage() {
    const { data, isLoading, error } = useExpenses();
    const deleteMutation = useDeleteExpense();

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [timeStampVisible, setTimeStampVisible] = useState(false);

    const [show, setShow] = useState(true);

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
        <main className="min-h-[calc(100vh-(3rem))] p-2">
            <button className="mx-auto max-w-6xl w-full flex cursor-pointer hover:text-blue-500" onClick={() => setShow(!show)}>
                <Image src={show ? "./arrow-open-right.svg" : "./arrow-open-down.svg"} alt="" width={10} height={10} /> &nbsp; <span>{show ? 'close' : 'open'}</span>
            </button>
            {
                show && <div className="flex flex-col justify-center items-center max-w-6xl mx-auto border border-2 border-red-500 bg-gray-200">
                    <div className="w-full text-left text-red-500 p-1 text-xs sm:text-sm md:text-lg">
                        1. Please note that this App is just for demo purpose,
                        Even though you are able to sign up and store the data,
                        the database will be cleared regularly.
                        <br />
                        <span className="text-color-2">2. To delete an expense, please double tap the delete icon, there will be no confirmation.</span>
                    </div>
                </div>
            }
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

            {isLoading && <p className="text-center w-full">Loading…</p>}
            {error && <p className="text-red-500 text-center w-full">{error.message}</p>}

            {
                data && (
                    <ExpensesTable
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        timeStampVisible={timeStampVisible}
                    />
                )
            }

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
        </main >
    );
}
