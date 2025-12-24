"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Expense, NewExpense } from "../types";

type AddExpenseContext = {
    previousExpenses?: Expense[];
    optimisticId: number;
};

const EXPENSES_QUERY_KEY = ["expenses"] as const;

export function useAddExpense() {
    const queryClient = useQueryClient();

    return useMutation<
        Expense,            // API response
        Error,              // Error
        NewExpense,         // Variables
        AddExpenseContext   // Context
    >({
        mutationFn: async (newExpense) => {
            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExpense),
            });

            if (!res.ok) {
                throw new Error("Failed to add expense");
            }

            return res.json();
        },

        // ⭐ Optimistic update
        onMutate: async (newExpense) => {
            await queryClient.cancelQueries({ queryKey: EXPENSES_QUERY_KEY });

            const previousExpenses =
                queryClient.getQueryData<Expense[]>(EXPENSES_QUERY_KEY);

            const optimisticId = -Date.now();

            queryClient.setQueryData<Expense[]>(
                EXPENSES_QUERY_KEY,
                (old = []) => [
                    ...old,
                    {
                        id: optimisticId,
                        amount: newExpense.amount,
                        description: newExpense.description,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    },
                ]
            );

            return { previousExpenses, optimisticId };
        },

        // ⭐ Replace optimistic expense with real server response
        onSuccess: (savedExpense, _vars, ctx) => {
            if (!ctx) return;

            queryClient.setQueryData<Expense[]>(
                EXPENSES_QUERY_KEY,
                (old = []) =>
                    old.map((expense) =>
                        expense.id === ctx.optimisticId
                            ? savedExpense
                            : expense
                    )
            );
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

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        }
    });
}
