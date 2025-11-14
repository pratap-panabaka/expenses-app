"use client";

import { useQuery } from "@tanstack/react-query";
import { Expense } from "../types";

export const fetchExpenses = async (): Promise<Expense[]> => {
    const res = await fetch("/api/expenses");
    if (!res.ok) throw new Error("Failed to fetch expenses");
    return res.json();
};

export const useExpenses = () =>
    useQuery({
        queryKey: ["expenses"],
        queryFn: fetchExpenses,
    });
