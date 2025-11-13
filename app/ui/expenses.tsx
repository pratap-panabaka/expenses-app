"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Modal from "./modal";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

// ------------------------------------------------------
// 1️⃣ Types
// ------------------------------------------------------
export type Expense = {
    id: number;
    amount: number;
    description: string;
    created_at: string;
    updated_at: string;
};

type NewExpense = {
    amount: number;
    description: string;
};

// ------------------------------------------------------
// 2️⃣ Fetch Expenses (GET)
// ------------------------------------------------------
const fetchExpenses = async (): Promise<Expense[]> => {
    const res = await fetch("/api/expenses");
    if (!res.ok) throw new Error("Failed to fetch expenses");
    return res.json();
};

// ------------------------------------------------------
// 3️⃣ Custom hook for Adding Expense (POST)
// ------------------------------------------------------
const useAddExpense = () => {
    const queryClient = useQueryClient(); // ✅ inside hook context

    return useMutation<Expense, Error, NewExpense>({
        mutationFn: async (newExpense) => {
            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExpense),
            });

            if (!res.ok) throw new Error("Failed to add expense");
            return res.json() as Promise<Expense>;
        },

        // ✅ Refetch expenses list automatically on success
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
    });
};

// ------------------------------------------------------
// 4️⃣ AddForm Component
// ------------------------------------------------------
const AddForm = ({ onClose }: { onClose: () => void }) => {
    const [amount, setAmount] = useState<number | "">("");
    const [description, setDescription] = useState<string>("");
    const addExpenseMutation = useAddExpense();

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value === "" ? "" : Number(e.target.value));
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (amount === "" || !description) return;

        addExpenseMutation.mutate(
            { amount, description },
            {
                onSuccess: () => {
                    setAmount("");
                    setDescription("");
                    onClose(); // close modal on success
                },
            }
        );
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <input
                className="form-input"
                type="number"
                onChange={handleAmountChange}
                placeholder="Amount"
                value={amount}
                required
            />
            <input
                className="form-input"
                type="text"
                onChange={handleDescriptionChange}
                placeholder="Description"
                value={description}
                required
            />
            <button
                type="submit"
                className="btn"
                disabled={addExpenseMutation.isPending}
            >
                {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
            </button>
            {addExpenseMutation.isError && (
                <p className="text-red-500">{addExpenseMutation.error?.message}</p>
            )}
        </form>
    );
};

// ------------------------------------------------------
// 5️⃣ Expenses Page Component
// ------------------------------------------------------
const ExpensesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: expenses, isLoading, error } = useQuery<Expense[], Error>({
        queryKey: ["expenses"],
        queryFn: fetchExpenses,
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <main className="p-4 min-h-[calc(100vh-64px)]">
            <div className="flex items-center justify-center gap-5 mb-4">
                <h1 className="text-16 sm:text-20 md:text-24 font-bold text-color-4">
                    EXPENSES
                </h1>
                <button
                    onClick={openModal}
                    className="cursor-pointer text-blue-500 font-bold"
                >
                    Add Expense
                </button>
            </div>

            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error.message}</p>}

            {expenses && expenses.length > 0 && (
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Created At</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Updated At</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((exp) => (
                                <tr key={exp.id} className="border-t border-gray-200">
                                    <td className="px-4 py-2 text-sm text-gray-700">{exp.id}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{exp.description}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{exp.amount}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">
                                        {new Date(exp.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700">
                                        {new Date(exp.updated_at).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700 flex gap-2">
                                        <button className="text-blue-500 hover:underline">Edit</button>
                                        <button className="text-red-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <AddForm onClose={closeModal} />
            </Modal>
        </main>
    );
};

// ------------------------------------------------------
// 6️⃣ Wrap in QueryClientProvider (root-level)
// ------------------------------------------------------
const queryClient = new QueryClient();

const Expenses = () => (
    <QueryClientProvider client={queryClient}>
        <ExpensesPage />
    </QueryClientProvider>
);

export default Expenses;
