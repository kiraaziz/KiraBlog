"use server"
import { supabase } from "@/utils/server/supabase"
import { db } from "@/server/db"

export async function useGetMedia() {
    const items: any = await db.media.findMany({
        orderBy: { createdAt: "desc" } 
    })
    return items
}

export async function useCreateMedia(data: { url: string; type?: string; title?: string; path?: string; size?: number ; }) {
    const { url, type, title, size, path } = data ?? {}
    const item = await db.media.create({
        data: {
            url,
            type: type ?? "",
            title: title ?? null,
            path: path ?? null,
            size: size ?? 0
        },
    })
    return item
}


export async function useDeleteMedia(id: number, path?: string, bucket: string = "images") {
    const deleted = await db.media.delete({ where: { id } })
    if (path) {
        await supabase.storage.from(bucket).remove([path])
    }

    return deleted
}
