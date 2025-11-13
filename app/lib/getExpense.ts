// /app/lib/getExpenses.ts
import db from "@/app/lib/db";

export type Expense = {
    id: number;
    user_id: number;
    description: string;
    amount: number;
    created_at: string;
};

export function getExpensesByUserId(user_id: number): Expense[] {
    const stmt = db.prepare("SELECT * FROM expenses WHERE user_id = ?");
    const expenses = stmt.all(user_id) as Expense[];
    return expenses;
}
