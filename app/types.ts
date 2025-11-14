export type Expense = {
    id: number;
    amount: number;
    description: string;
    created_at: string;
    updated_at: string;
};

export type NewExpense = {
    amount: number;
    description: string;
};

export type EditExpense = {
    amt: number;
    desc: string;
};
