"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Expense, EditExpense } from "../types";

type EditExpenseContext = {
    previousExpenses?: Expense[];
};

const EXPENSES_QUERY_KEY = ["expenses"] as const;

export function useEditExpense(id: number) {
    const queryClient = useQueryClient();

    return useMutation<
        Expense,              // API response
        Error,                // Error
        EditExpense,          // Variables
        EditExpenseContext    // Context
    >({
        mutationFn: async (payload) => {
            const res = await fetch(`/api/expenses/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Failed to update expense");
            }

            return res.json();
        },

        // ⭐ Optimistic update
        onMutate: async (update) => {
            await queryClient.cancelQueries({ queryKey: EXPENSES_QUERY_KEY });

            const previousExpenses =
                queryClient.getQueryData<Expense[]>(EXPENSES_QUERY_KEY);

            queryClient.setQueryData<Expense[]>(
                EXPENSES_QUERY_KEY,
                (old = []) =>
                    old.map((expense) =>
                        expense.id === id
                            ? {
                                ...expense,
                                amount: update.amt,
                                description: update.desc,
                                updated_at: new Date().toISOString(),
                            }
                            : expense
                    )
            );

            return { previousExpenses };
        },

        // ⭐ Rollback on error
        onError: (_error, _vars, ctx) => {
            if (ctx?.previousExpenses) {
                queryClient.setQueryData(
                    EXPENSES_QUERY_KEY,
                    ctx.previousExpenses
                );
            }
        },

        // ⭐ Replace optimistic data with server response
        onSuccess: (updatedExpense) => {
            queryClient.setQueryData<Expense[]>(
                EXPENSES_QUERY_KEY,
                (old = []) =>
                    old.map((expense) =>
                        expense.id === updatedExpense.id
                            ? updatedExpense
                            : expense
                    )
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        }
    });
}
