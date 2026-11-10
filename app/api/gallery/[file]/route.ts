import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { galleryFiles } from '@/data/gallery'

// Gallery photos live in a private S3 bucket (gallery/ folder); this route reads them with server-side keys.
// next/image fetches from here, then resizes and caches the result, so S3 is hit rarely
const s3 = new S3Client({
  region: process.env.S3_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
  },
})

const known = new Set(galleryFiles)

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  // Only serve listed gallery photos, never arbitrary keys from the bucket
  if (!known.has(file)) return new Response('Not found', { status: 404 })
  try {
    const obj = await s3.send(new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: `gallery/${file}` }))
    return new Response(obj.Body!.transformToWebStream(), {
      headers: {
        'Content-Type': obj.ContentType ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (e) {
    console.error('gallery S3 read failed', file, e)
    return new Response('Not found', { status: 404 })
  }
}
