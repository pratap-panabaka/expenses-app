import { NextResponse } from "next/server";

export const POST = async () => {
    const res = NextResponse.json({ message: "Logged out" });

    // Clear the token cookie
    res.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // expire immediately
    });

    return res;
};
