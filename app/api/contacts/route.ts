import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEY = "site:contacts";

interface Contact {
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  submittedAtFormatted?: string;
}

// POST: save a contact
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contact = {
      name,
      email,
      message,
      submittedAt: new Date().toISOString(),
    };

    await redis.rpush(KEY, JSON.stringify(contact));

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error("Error storing contact:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: fetch all contacts
export async function GET() {
  try {
    const contacts = (await redis.lrange(KEY, 0, -1)) || [];

    const parsedContacts = contacts.map((item) => {
      // parse if string
      const c: Contact = typeof item === "string" ? JSON.parse(item) : item;

      const date = new Date(c.submittedAt);
      c.submittedAtFormatted = date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
      return c;
    });

    return NextResponse.json({ contacts: parsedContacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

