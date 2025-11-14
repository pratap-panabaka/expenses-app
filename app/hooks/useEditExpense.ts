"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Expense, EditExpense } from "../types";

export const useEditExpense = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation<
        Expense,         // returned data type
        Error,           // error type
        EditExpense,     // variables passed into mutate()
        { previous: Expense[] | undefined } // ⭐ context returned by onMutate
    >({
        mutationFn: async (payload) => {
            const res = await fetch(`/api/expenses/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to update expense");
            return res.json();
        },

        // ⭐ OPTIMISTIC UPDATE
        onMutate: async (update) => {
            await queryClient.cancelQueries({ queryKey: ["expenses"] });

            const previous = queryClient.getQueryData<Expense[]>(["expenses"]);

            queryClient.setQueryData<Expense[]>(["expenses"], (old) =>
                old
                    ? old.map((exp) =>
                        exp.id === id
                            ? {
                                ...exp,
                                amount: update.amt,
                                description: update.desc,
                                updated_at: new Date().toISOString(),
                            }
                            : exp
                    )
                    : []
            );

            return { previous }; // ⭐ TS knows context type now
        },

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
