"use server"
import { db } from "@/server/db"
import { s3 } from "@/server/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

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
    try {
        const deleted = await db.media.delete({ where: { id } })
        
        if (path) {
            await s3.send(new DeleteObjectCommand({
                Bucket: bucket,
                Key: path,
            }))
        }

        return deleted
    } catch (error) {
        return
    }
}

