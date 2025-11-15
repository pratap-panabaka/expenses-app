export type Expense = {
    id: number | undefined;
    amount: number;
    description: string;
    created_at: string | undefined;
    updated_at: string | undefined;
};

export type NewExpense = {
    amount: number;
    description: string;
};

export type EditExpense = {
    amt: number;
    desc: string;
};
