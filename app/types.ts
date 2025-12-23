export type Expense = {
    id: number | undefined;
    amount: string;
    description: string;
    created_at: string;
    updated_at: string;
};

export type NewExpense = {
    amount: string;
    description: string;
};

export type EditExpense = {
    amt: string;
    desc: string;
};
