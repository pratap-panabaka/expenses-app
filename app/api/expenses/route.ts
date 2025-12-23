import db from "@/app/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

/* ===================== GET ===================== */
export const GET = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload: any;
    try {
        const verified = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
            maxTokenAge: "1d",
        });
        payload = verified.payload;
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;

    try {
        const [rows] = await db.execute(
            "SELECT * FROM expenses WHERE user_id = ?",
            [userId]
        );

        return NextResponse.json(rows);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch expenses" },
            { status: 500 }
        );
    }
};

/* ===================== POST ===================== */
export const POST = async (req: Request) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload: any;
    try {
        const verified = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
            maxTokenAge: "1d",
        });
        payload = verified.payload;
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;

    let body: { description?: string; amount?: number };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { description, amount } = body;

    if (!description || typeof description !== "string") {
        return NextResponse.json(
            { error: "Description is required" },
            { status: 400 }
        );
    }

    if (typeof amount !== "number" || amount <= 0) {
        return NextResponse.json(
            { error: "Amount must be a positive number" },
            { status: 400 }
        );
    }

    try {
        const [result]: any = await db.execute(
            "INSERT INTO expenses (user_id, description, amount) VALUES (?, ?, ?)",
            [userId, description, amount]
        );

        const expenseId = result.insertId;

        const [rows]: any = await db.execute(
            "SELECT * FROM expenses WHERE id = ?",
            [expenseId]
        );

        return NextResponse.json(rows[0], { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to create expense" },
            { status: 500 }
        );
    }
};
