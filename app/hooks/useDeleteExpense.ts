"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Expense } from "../types";

export const useDeleteExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/expenses/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete expense");
            return id;
        },

        // ⭐ Optimistic update
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["expenses"] });

            const previous = queryClient.getQueryData<Expense[]>(["expenses"]);

            queryClient.setQueryData<Expense[]>(["expenses"], (old) =>
                old ? old.filter((exp) => exp.id !== id) : []
            );

            return { previous };
        },

        onError: (_err, _id, ctx) => {
            if (ctx?.previous) {
                queryClient.setQueryData(["expenses"], ctx.previous);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
    });
};
