"use client";

import { useEffect, useState } from "react";
import formatLocalDateTime from "../lib/dateFormat";
import { useExpenses } from "../hooks/useExpense";
import intToWords from "../lib/intToWords";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { Saira_Stencil_One } from 'next/font/google';

const spaceGrotesk = Saira_Stencil_One({
    subsets: ['latin'],
    variable: "--font-sg",
    weight: '400',
});

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
        <div className="w-full justify-center flex items-start">
            <table className="w-full text-color-4 max-w-6xl">
                <thead className="bg-color-4 text-color-1 sticky top-[164px]">
                    <tr>
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
            <div className={`bg-black 
            h-[36px] bg-color-4 flex justify-center items-center
            text-color-1 fixed bottom-0 w-full text-xs sm:text-lg ${spaceGrotesk.className}`}
            >Total is &nbsp;<span className={"text-color-3"}>{intToWords(total)} &nbsp;</span><span>{total} {currency}</span></div >
        </div>
    );
}
