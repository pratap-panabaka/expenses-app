export type Expense = {
    id: number | undefined;
    amount: string;
    description: string;
    created_at: string | undefined;
    updated_at: string | undefined;
};

export type NewExpense = {
    amount: string;
    description: string;
};

export type EditExpense = {
    amt: string;
    desc: string;
};
