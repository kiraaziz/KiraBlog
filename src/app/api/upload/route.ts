import { NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import sharp from "sharp"
import { useCreateMedia } from "@/utils/hooks/useMedia"
import { s3 } from "@/server/s3"

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File
        if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

        const arrayBuffer:any = await file.arrayBuffer()
        let buffer:any = Buffer.from(arrayBuffer as ArrayBuffer)

        let ext = file.name.split(".").pop()
        let contentType = file.type
        if (file.type.startsWith("image/")) {
            buffer = await sharp(buffer).webp({ quality: 80 }).toBuffer()
            ext = "webp"
            contentType = "image/webp"
        }

        const id = `image-${Date.now()}`
        const key = `${id}.${ext}`

        await s3.send(new PutObjectCommand({
            Bucket: "images",
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }))

        const url = `${process.env.MINIO_URL}/${"images"}/${key}`
        const size = buffer.length
        const type = contentType
        const title = file.name
        const path = key

        console.log(url)
        const media = await useCreateMedia({
            url,
            type,
            title,
            path,
            size,
        })

        // await setupBucket()
        return NextResponse.json({ id: media.id, url: media.url, path: media.path })
    } catch (error) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}


// async function setupBucket() {
//     const bucketName = "images"
 
//     const bucketPolicy = {
//         Version: "2012-10-17",
//         Statement: [
//             {
//                 Effect: "Allow",
//                 Principal: "*",
//                 Action: ["s3:GetObject"],
//                 Resource: [`arn:aws:s3:::${bucketName}/*`]
//             }
//         ]
//     }
    
//     try {
//         await s3.send(new PutBucketPolicyCommand({
//             Bucket: bucketName,
//             Policy: JSON.stringify(bucketPolicy)
//         }))
//         console.log(`Bucket policy set for ${bucketName}`)
//     } catch (error) {
//         console.error('Error setting bucket policy:', error)
//     }
// }

