"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Expense, NewExpense } from "../types";

export const useAddExpense = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Expense,         // TData returned by API
        Error,           // TError
        NewExpense,      // TVariables passed to mutate()
        { previous: Expense[] | undefined } // ⭐ TContext
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

        // ⭐ TYPE-SAFE rollback
        onError: (_err, _data, ctx) => {
            if (ctx?.previous) {
                queryClient.setQueryData(["expenses"], ctx.previous);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
    });
};
