"use client";
import { useState } from "react";
import { useUpsertSetting } from "@/utils/hooks/useSettings";
import { useRouter } from "next/navigation";

const CreateSettings = () => {
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("key", key);
            formData.append("value", value);
            await useUpsertSetting(formData);
            setKey("");
            setValue("");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to save setting.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-1">
                <label className="text-sm" htmlFor="key">Name</label>
                <input
                    id="key"
                    name="key"
                    className="w-full rounded border px-3 py-2"
                    placeholder="e.g. site_title"
                    required
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="space-y-1 md:col-span-2">
                <label className="text-sm" htmlFor="value">Content</label>
                <textarea
                    id="value"
                    name="value"
                    rows={6}
                    className="w-full rounded border px-3 py-2 font-mono"
                    placeholder="Value..."
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    disabled={loading}
                />
            </div>
            {error && (
                <div className="md:col-span-2 text-red-600 text-sm">{error}</div>
            )}
            <div className="md:col-span-2">
                <button
                    type="submit"
                    className="rounded bg-primary px-4 py-2 font-medium text-white"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
};

export default CreateSettings