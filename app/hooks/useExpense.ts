"use client";

import { useQuery } from "@tanstack/react-query";
import { Expense } from "../types";

const fetchExpenses = async (): Promise<Expense[]> => {
    const res = await fetch("/api/expenses");
    if (!res.ok) throw new Error("Failed to fetch expenses");
    return res.json();
};

export const useExpenses = (
    sortBy?: "idAsc" | "idDes" | "descAsc" | "descDes" | "amtAsc" | "amtDes"
) => {
    return useQuery({
        queryKey: ["expenses", sortBy],
        queryFn: fetchExpenses,
        select: (data: Expense[]) => {
            if (!data) return [];

            const normalized = data.map(exp => ({
                ...exp,
                id: Number(exp.id),
                amount: exp.amount,
                description: String(exp.description),
            }));

            if (!sortBy) return normalized;

            return [...normalized].sort((a, b) => {
                switch (sortBy) {
                    case "idAsc": return a.id - b.id;
                    case "idDes": return b.id - a.id;
                    case "descAsc": return a.description.localeCompare(b.description);
                    case "descDes": return b.description.localeCompare(a.description);
                    case "amtAsc": return Number(a.amount) - Number(b.amount);
                    case "amtDes": return Number(b.amount) - Number(a.amount);
                    default: return 0;
                }
            });
        },
    });
};
