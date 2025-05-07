'use server'

import { Client } from 'minio'
import { v4 as uuidv4 } from 'uuid'

// Configure your MinIO client
const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
})

// This is your server action that handles the upload
export async function uploadFile(formData: FormData) {
    try {
        const file = formData.get('file') as File

        if (!file) {
            return { success: false, error: 'No file provided' }
        }

        // Convert File to Buffer
        const buffer = Buffer.from(await file.arrayBuffer())

        // Generate a unique filename
        const fileExtension = file.name.split('.').pop() || ''
        const fileName = `${uuidv4()}.${fileExtension}`

        const bucketName = process.env.MINIO_BUCKET_NAME || 'my-bucket'

        // Make sure the bucket exists
        const bucketExists = await minioClient.bucketExists(bucketName)
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, process.env.MINIO_REGION || 'us-east-1')
        }

        // Upload to MinIO
        await minioClient.putObject(bucketName, fileName, buffer, buffer.length, { 'Content-Type': file.type })

        // Return the URL to the uploaded file
        const fileUrl = `${process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`}/${bucketName}/${fileName}`

        return { success: true, fileUrl }
    } catch (error) {
        console.log(error)
        return { success: false, error: 'Upload failed' }
    }
}
