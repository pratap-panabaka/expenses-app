import db from "@/app/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;
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
    const stmt = db.prepare("SELECT amount, description FROM expenses WHERE user_id = ? AND id = ?");
    const expense = stmt.get(userId, id);

    return NextResponse.json(expense);
};

export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;
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

    let body: { desc?: string; amt?: number };
    try {
        body = await req.json();
    } catch (err) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { desc, amt } = body;

    if (!desc || typeof desc !== "string") {
        return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    if (amt === undefined || typeof amt !== "number" || amt < 0) {
        return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
    }

    try {
        const stmt = db.prepare(
            "UPDATE expenses SET description = ?, amount = ? WHERE user_id = ? AND id = ?"
        );
        const result = stmt.run(desc, amt, userId, id);

        return NextResponse.json({ status: 200 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const resolvedParams = await params;
    const { id } = resolvedParams;
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

    try {
        const stmt = db.prepare(
            "DELETE FROM expenses WHERE user_id = ? AND id = ?"
        );
        const result = stmt.run(userId, id);
        console.log(result);

        return NextResponse.json({ status: 200 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
    }
}