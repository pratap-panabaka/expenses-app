"use client";

import { useState } from "react";
import { Expense } from "../types";
import formatLocalDateTime from "../lib/dateFormat";
import { useExpenses } from "../hooks/useExpense";
import intToWords from "../lib/intToWords";

export default function ExpensesTable({
    expenses,
    onEdit,
    onDelete,
}: {
    expenses: Expense[];
    onEdit: (id: number, amount: number, description: string) => void;
    onDelete: (id: number) => void;
}) {
    const [timeStampVisible, setTimeStampVisible] = useState(false);
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
        <div className="w-full flex flex-col items-center">
            <div className="overflow-x-auto max-w-6xl w-full">
                <div className="w-full text-center text-red-500 py-2">
                    Please note that this App is just for demo purpose,
                    Even though you are able to sign up and store the data,
                    the database will be cleared regularly.
                </div>
                <div className="flex justify-end w-full">
                    <button
                        className="text-blue-400 cursor-pointer font-bold"
                        onClick={() => setTimeStampVisible(!timeStampVisible)}
                    >
                        {timeStampVisible ? "Hide Time Stamps" : "Show Time Stamps"}
                    </button>
                </div>
                <table className="w-full justify-center border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border cursor-pointer hover:bg-gray-400" onClick={() => toggleSort("id")}>
                                ID
                            </th>
                            <th className="px-4 py-2 border cursor-pointer hover:bg-gray-400" onClick={() => toggleSort("desc")}>
                                Description
                            </th>
                            <th className="px-4 py-2 border cursor-pointer hover:bg-gray-400" onClick={() => toggleSort("amt")}>
                                Amount
                            </th>
                            <th className="px-4 py-2 border">Actions</th>
                            {timeStampVisible && (
                                <>
                                    <th className="px-4 py-2 border whitespace-nowrap text-center">
                                        Created At
                                    </th>
                                    <th className="px-4 py-2 border whitespace-nowrap text-center">
                                        Updated At
                                    </th>
                                </>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {displayedExpenses.map((exp) => (
                            <tr key={exp.id} className="border-t border-gray-200">
                                <td className="px-4 py-2 border whitespace-nowrap text-right">
                                    {exp.id}
                                </td>
                                <td className="px-4 py-2 border">{exp.description}</td>
                                <td className="px-4 py-2 border text-right">{exp.amount}</td>

                                {/* Actions */}
                                <td className="px-4 py-2 border">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            className="text-blue-500 cursor-pointer font-bold"
                                            onClick={() =>
                                                onEdit(exp.id, exp.amount, exp.description)
                                            }
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-500 cursor-pointer font-bold"
                                            onDoubleClick={() => onDelete(exp.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>

                                {timeStampVisible && (
                                    <>
                                        <td className="px-4 py-2 border whitespace-nowrap text-center">
                                            {formatLocalDateTime(exp.created_at)}
                                        </td>
                                        <td className="px-4 py-2 border whitespace-nowrap text-center">
                                            {formatLocalDateTime(exp.updated_at)}
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        <tr className="border-t border-gray-400 font-bold bg-gray-50">
                            <td colSpan={2} className="px-4 py-2 border text-right">
                                Total is {intToWords(total)}
                            </td>
                            <td className="px-4 py-2 border text-right">{total}</td>
                            <td className="px-4 py-2 border">&nbsp;</td>
                            {timeStampVisible && (
                                <>
                                    <td className="px-4 py-2 border">&nbsp;</td>
                                    <td className="px-4 py-2 border">&nbsp;</td>
                                </>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
