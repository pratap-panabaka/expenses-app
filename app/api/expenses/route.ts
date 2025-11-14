import db from "@/app/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    let payload;
    try {
        const verified = await jwtVerify(token, secret, {
            algorithms: ['HS256'],
            maxTokenAge: '1d',
        });
        payload = verified.payload;
    } catch (err) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;

    // Fetch expenses
    const stmt = db.prepare("SELECT * FROM expenses WHERE user_id = ?");
    const expenses = stmt.all(userId);

    return NextResponse.json(expenses);
};

export const POST = async (req: Request) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    let payload;
    try {
        const verified = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
            maxTokenAge: "1d",
        });
        payload = verified.payload;
    } catch (err) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;

    let body: { description?: string; amount?: number };
    try {
        body = await req.json();
    } catch (err) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { description, amount } = body;

    if (!description || typeof description !== "string") {
        return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    if (amount === undefined || typeof amount !== "number" || amount <= 0) {
        return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    try {
        const stmt = db.prepare(
            "INSERT INTO expenses (user_id, description, amount) VALUES (?, ?, ?)"
        );
        const result = stmt.run(userId, description, amount);

        // Fetch the newly created expense
        const expenseId = result.lastInsertRowid;
        const expense = db
            .prepare("SELECT * FROM expenses WHERE id = ?")
            .get(expenseId);

        return NextResponse.json(expense, { status: 201 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
    }
};
