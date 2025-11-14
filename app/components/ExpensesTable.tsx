import { Expense } from "../types";

export default function ExpensesTable({
    expenses,
    onEdit,
    onDelete,
}: {
    expenses: Expense[];
    onEdit: (id: number, amount: number, description: string) => void;
    onDelete: (id: number) => void;
}) {
    return (
        <div className="overflow-x-auto w-full">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Created At</th>
                        <th className="px-4 py-2">Updated At</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {expenses.map((exp) => (
                        <tr key={exp.id} className="border-t border-gray-200">
                            <td className="px-4 py-2">{exp.id}</td>
                            <td className="px-4 py-2">{exp.description}</td>
                            <td className="px-4 py-2">{exp.amount}</td>
                            <td className="px-4 py-2">
                                {new Date(exp.created_at).toLocaleString()}
                            </td>
                            <td className="px-4 py-2">
                                {new Date(exp.updated_at).toLocaleString()}
                            </td>

                            <td className="px-4 py-2 flex gap-3">
                                <button
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() =>
                                        onEdit(exp.id, exp.amount, exp.description)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="text-red-500 cursor-pointer"
                                    onDoubleClick={() => onDelete(exp.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
