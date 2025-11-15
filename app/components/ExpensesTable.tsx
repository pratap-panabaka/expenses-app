"use client";

import { useState } from "react";
import formatLocalDateTime from "../lib/dateFormat";
import { useExpenses } from "../hooks/useExpense";
import intToWords from "../lib/intToWords";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin4Fill } from "react-icons/ri";

export default function ExpensesTable({
    onEdit,
    onDelete,
    timeStampVisible,
}: {
    onEdit: (id: number, amount: number, description: string) => void;
    onDelete: (id: number) => void;
    timeStampVisible: boolean;
}) {
    const [sortField, setSortField] = useState<"id" | "desc" | "amt">("id");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const getSortKey = () => {
        if (sortField === "id") return sortOrder === "asc" ? "idAsc" : "idDes";
        if (sortField === "desc") return sortOrder === "asc" ? "descAsc" : "descDes";
        if (sortField === "amt") return sortOrder === "asc" ? "amtAsc" : "amtDes";
    };

    const { data: displayedExpenses = [] } = useExpenses(getSortKey());
    const total = displayedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const toggleSort = (field: "id" | "desc" | "amt") => {
        if (sortField === field) {
            // toggle order
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("asc"); // default when switching field
        }
    };

    return (
        <div className="w-full justify-center flex items-start">
            <table className="w-full text-color-4 max-w-6xl">
                <thead className="bg-gray-100 sticky top-[164px]">
                    <tr>
                        <th className="border cursor-pointer hover:bg-gray-200" onClick={() => toggleSort("id")}>ID</th>
                        <th className="border cursor-pointer hover:bg-gray-200" onClick={() => toggleSort("desc")}>Description</th>
                        <th className="border cursor-pointer hover:bg-gray-200" onClick={() => toggleSort("amt")}>Amount</th>
                        <th className="border">Actions</th>
                        {timeStampVisible && (
                            <>
                                <th className="border whitespace-nowrap text-center">Created At</th>
                                <th className="border whitespace-nowrap text-center">Updated At</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {displayedExpenses.map((exp) => (
                        <tr key={exp.id} className="odd:bg-color-5/90 even:bg-color-5 text-white">
                            <td className="border px-2 text-right align-middle">{exp.id}</td>
                            <td className="border px-2 align-middle">{exp.description}</td>
                            <td className="border px-2 text-right align-middle">{exp.amount}</td>
                            <td className="border">
                                <div className="flex justify-center items-center gap-2 h-full">
                                    <button onClick={() => onEdit(exp.id, exp.amount, exp.description)}>
                                        <FaEdit className="cursor-pointer hover:text-blue-400" size={20} />
                                    </button>
                                    <button onDoubleClick={() => onDelete(exp.id)}>
                                        <RiDeleteBin4Fill className="cursor-pointer hover:text-red-400" size={20} />
                                    </button>
                                </div>
                            </td>

                            {timeStampVisible && (
                                <>
                                    <td className="border p-0 text-center align-middle">
                                        {formatLocalDateTime(exp.created_at)}
                                    </td>
                                    <td className="border p-0 text-center align-middle">
                                        {formatLocalDateTime(exp.updated_at)}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table >
            <div className="bg-black h-[36px] bg-color-4 flex justify-center items-center text-color-1 fixed bottom-0 w-full">Total is &nbsp;<span className="text-color-3 text-lg">{intToWords(total)} &nbsp;</span><span className="text-lg">{total}</span></div >
        </div>
    );
}
