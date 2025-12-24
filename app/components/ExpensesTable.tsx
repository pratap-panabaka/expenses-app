"use client";

import { useEffect, useState } from "react";
import { useExpenses } from "../hooks/useExpense";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin4Fill } from "react-icons/ri";

export default function ExpensesTable({
    onEdit,
    onDelete,
    timeStampVisible,
}: {
    onEdit: (id: number, amount: string, description: string) => void;
    onDelete: (id: number) => void;
    timeStampVisible: boolean;
}) {
    const [sortField, setSortField] = useState<"id" | "desc" | "amt">("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currency, setCurrency] = useState<string>('');

    const getSortKey = () => {
        if (sortField === "id") return sortOrder === "asc" ? "idAsc" : "idDes";
        if (sortField === "desc") return sortOrder === "asc" ? "descAsc" : "descDes";
        if (sortField === "amt") return sortOrder === "asc" ? "amtAsc" : "amtDes";
    };

    const { data: displayedExpenses = [] } = useExpenses(getSortKey());
    const total = displayedExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    const toggleSort = (field: "id" | "desc" | "amt") => {
        if (sortField === field) {
            // toggle order
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("asc"); // default when switching field
        }
    };

    useEffect(() => {
        const getUserCurrency = async (): Promise<void> => {
            let cur;
            try {
                const res = await fetch("https://ipapi.co/json/");
                const data = await res.json();
                cur = data.currency || "";
            } catch (err) {
                console.error("Could not get currency from API:", err);
                cur = ""
            }
            setCurrency(cur);
        };
        getUserCurrency();
    }, []);

    return (
        <>
            <table className="w-full text-color-4 text-xs sm:text-sm md:text-lg max-w-6xl border border-2 mx-auto">
                <thead className="bg-color-4 text-white">
                    <tr className="border">
                        <th className="cursor-pointer hover:text-white" onClick={() => toggleSort("id")}>ID</th>
                        <th className="cursor-pointer hover:text-white" onClick={() => toggleSort("desc")}>Description</th>
                        <th className="cursor-pointer hover:text-white" onClick={() => toggleSort("amt")}>Amount</th>
                        <th className="">Actions</th>
                        {timeStampVisible && (
                            <>
                                <th className="whitespace-nowrap text-center">Created At</th>
                                <th className="whitespace-nowrap text-center">Updated At</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {displayedExpenses.map((exp) => (
                        <tr key={exp.id} className="odd:bg-gray-500/10 even:bg-gray-500/20">
                            <td className="border px-2 text-right align-middle">{exp.id}</td>
                            <td className="border px-2 align-middle">{exp.description}</td>
                            <td className="border px-2 text-right align-middle">{exp.amount}</td>
                            <td className="border">
                                <div className="flex justify-center items-center gap-2 h-full text-xs sm:text-sm md:text-md lg:text-lg">
                                    <button onClick={() => onEdit(exp.id, exp.amount, exp.description)}>
                                        <FaEdit className="cursor-pointer hover:text-blue-400" />
                                    </button>
                                    <button onDoubleClick={() => onDelete(exp.id)}>
                                        <RiDeleteBin4Fill className="cursor-pointer hover:text-red-400" />
                                    </button>
                                </div>
                            </td>

                            {timeStampVisible && (
                                <>
                                    <td className="border p-0 text-end talign-middle pe-2">
                                        {new Date(exp.created_at).toLocaleString()}
                                    </td>
                                    <td className="border p-0 text-end align-middle pe-2">
                                        {new Date(exp.updated_at).toLocaleString()}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table >
            <div className="text-center text-sm sm:text-md md:text-lg lg:text-xl text-color-4 font-bold">Total is {total.toFixed(2)} {currency}</div>
        </>
    );
}
