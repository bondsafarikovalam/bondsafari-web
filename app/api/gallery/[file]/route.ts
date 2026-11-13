import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { galleryFiles } from '@/data/gallery'

// Gallery photos live in a private S3 bucket (gallery/ folder); this route reads them with server-side keys.
// next/image fetches from here, then resizes and caches the result, so S3 is hit rarely
// With S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY set (Vercel, local) those keys are used; without them the AWS SDK's
// default chain applies, so on AWS the App Runner / ECS task role grants read access and no key is stored anywhere
const keys = process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
  ? { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY }
  : undefined
const s3 = new S3Client({ region: process.env.S3_REGION || 'ap-south-1', credentials: keys })

const known = new Set(galleryFiles)

// A missing setting is reported once in the server log, not on every photo request, and never to the browser
let warned = false
const warnOnce = (message: string) => {
  if (warned) return
  warned = true
  console.warn(`Gallery: ${message}`)
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  // Only serve listed gallery photos, never arbitrary keys from the bucket
  if (!known.has(file)) return new Response('Not found', { status: 404 })
  const bucket = process.env.S3_BUCKET?.trim()
  if (!bucket) {
    warnOnce('S3_BUCKET is not set, so gallery photos cannot be served. Set S3_BUCKET (and S3_REGION) in the server environment.')
    return new Response('Not found', { status: 404 })
  }
  // Only one of the two keys set means a typo: the SDK then falls back to its default chain (task role, profile)
  if (!process.env.S3_ACCESS_KEY_ID !== !process.env.S3_SECRET_ACCESS_KEY) warnOnce('only one of S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY is set, so both are ignored and the default AWS credential chain is used.')
  try {
    const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: `gallery/${file}` }))
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
