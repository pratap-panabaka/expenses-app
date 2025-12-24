"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Expense } from "../types";

type DeleteExpenseContext = {
    previousExpenses?: Expense[];
};

const EXPENSES_QUERY_KEY = ["expenses"] as const;

export function useDeleteExpense() {
    const queryClient = useQueryClient();

    return useMutation<
        number,                // returned value (deleted id)
        Error,                 // error
        number,                // variables (id)
        DeleteExpenseContext   // context
    >({
        mutationFn: async (id) => {
            const res = await fetch(`/api/expenses/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete expense");
            }

            return id;
        },

        // ⭐ Optimistic delete
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: EXPENSES_QUERY_KEY });

            const previousExpenses =
                queryClient.getQueryData<Expense[]>(EXPENSES_QUERY_KEY);

            queryClient.setQueryData<Expense[]>(
                EXPENSES_QUERY_KEY,
                (old = []) => old.filter((expense) => expense.id !== id)
            );

            return { previousExpenses };
        },

        // ⭐ Rollback on error
        onError: (_error, _id, ctx) => {
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
