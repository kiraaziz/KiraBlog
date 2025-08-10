"use server"
import { db } from "@/server/db"

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function addLetter(email: string) {
    if (!isValidEmail(email)) {
        return {
            state: "error",
            isSuccess: false,
            isError: true,
            message: "Invalid email address.",
            data: null,
        };
    }
    try {
        const letter = await db.letter.create({
            data: {
                email,
            },
        });
        return {
            state: "success",
            isSuccess: true,
            isError: false,
            message: "Successfully subscribed.",
            data: letter,
        };
    } catch (error: any) {
        let msg = "An error occurred.";
        if (error?.code === "P2002") {
            msg = "This email is already subscribed.";
        }
        return {
            state: "error",
            isSuccess: false,
            isError: true,
            message: msg,
            data: null,
        };
    }
}