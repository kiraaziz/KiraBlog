"use client";
import { useState } from "react";
import { useDeleteSetting } from "@/utils/hooks/useSettings";
import { useRouter } from "next/navigation";

type DeleteSettingsProps = {
    id: number;
};

const DeleteSettings = ({ id }: DeleteSettingsProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("id", String(id));
            await useDeleteSetting(formData);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to delete setting.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleDelete}>
            <input type="hidden" name="id" value={id} />
            {error && (
                <div className="text-red-600 text-sm mb-2">{error}</div>
            )}
            <button
                type="submit"
                className="rounded border border-red-600 px-3 py-1 text-sm text-red-600"
                disabled={loading}
            >
                {loading ? "Deleting..." : "Delete"}
            </button>
        </form>
    );
};

export default DeleteSettings;