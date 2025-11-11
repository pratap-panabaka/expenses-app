"use client";

import { useEffect, useState } from "react";
import Message from "@/models/message";

const FetchMessages = () => {
    const [messages, setMessages] = useState<Message[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/contacts"); // fetch from new route
                const json = await response.json();
                setMessages(Array.isArray(json.contacts) ? json.contacts : []);
            } catch (e) {
                console.error("Error fetching messages:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-color-1 min-h-[calc(100vh-4rem)] content-start">
            {loading && (
                <h4 className="col-span-full text-center text-color-4">
                    Fetching messages, please wait...
                </h4>
            )}

            {!loading && messages?.length === 0 && (
                <h4 className="col-span-full text-center text-color-4">
                    No messages found.
                </h4>
            )}

            {messages?.map((message) => (
                <div
                    key={message.id}
                    className="bg-color-3 text-white p-4 rounded-lg flex flex-col gap-1"
                >
                    <p className="font-semibold">{message.name}</p>
                    <p className="text-xs">{message.email}</p>
                    <p className="truncate">{message.message}</p>
                    <p className="text-right text-xs text-gray-200">
                        {message.submittedAtFormatted}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default FetchMessages;
