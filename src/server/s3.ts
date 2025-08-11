
import { S3Client } from "@aws-sdk/client-s3";


const s3 = new S3Client({
    region: "us-east-1",
    endpoint: process.env.MINIO_URL!,
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY!,
        secretAccessKey: process.env.MINIO_SECRET_KEY!,
    },
    forcePathStyle: true,
});

export { s3 }