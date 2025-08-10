"use client"
import { useRef, useState } from "react";
import { addLetter } from "@/utils/hooks/useNewsletter";
import { toast } from "sonner";

const NewLetter = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputRef.current) return;
        const email = inputRef.current.value.trim();
        if (!email) {
            toast.error("Please enter your email.");
            return;
        }
        setLoading(true);
        try {
            const res = await addLetter(email);
            if (res.isSuccess) {
                toast.success(res.message);
                inputRef.current.value = "";
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="flex lg:flex-row gap-1 lg:gap-0 flex-col w-full" onSubmit={handleSubmit}>
            <input
                ref={inputRef}
                type="email"
                required
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-full lg:rounded-r-none border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
            />
            <button
                type="submit"
                className="px-5 p-2 w-max rounded-full lg:rounded-l-none  bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"
                disabled={loading}
            >
                {loading ? "Subscribing..." : "Subscribe"}
            </button>
        </form>
    );
};

export default NewLetter;