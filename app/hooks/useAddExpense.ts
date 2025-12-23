"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Expense, NewExpense } from "../types";

type AddExpenseContext = {
    previous?: Expense[];
    optimisticId: number;
};

export const useAddExpense = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Expense,          // TData (API response)
        Error,            // TError
        NewExpense,       // TVariables
        AddExpenseContext // ✅ TContext
    >({
        mutationFn: async (newExpense) => {
            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExpense),
            });

            if (!res.ok) throw new Error("Failed to add expense");
            return res.json();
        },

        // ⭐ Optimistic update
        onMutate: async (newExpense) => {
            await queryClient.cancelQueries({ queryKey: ["expenses"] });

            const previous = queryClient.getQueryData<Expense[]>(["expenses"]);
            const optimisticId = Date.now() * -1;

            queryClient.setQueryData<Expense[]>(["expenses"], (old = []) => [
                ...old,
                {
                    id: optimisticId,
                    amount: newExpense.amount,
                    description: newExpense.description,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ]);

            return { previous, optimisticId };
        },

        // ⭐ Replace optimistic row with real server data
        onSuccess: (savedExpense, _vars, ctx) => {
            if (!ctx) return;

            queryClient.setQueryData<Expense[]>(["expenses"], (old = []) =>
                old.map((expense) =>
                    expense.id === ctx.optimisticId ? savedExpense : expense
                )
            );
        },

        // ⭐ Rollback on error
        onError: (_err, _vars, ctx) => {
            if (ctx?.previous) {
                queryClient.setQueryData(["expenses"], ctx.previous);
            }
        },

        // ❌ No invalidate needed anymore
    });
};
