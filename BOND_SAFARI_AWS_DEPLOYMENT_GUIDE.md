# Bond Safari – AWS Deployment Guide

Nothing in this guide has been deployed. It is written from the actual project: Next.js 16 App Router with ISR, route handlers and
`next/image`.

## 1. Does it need a server?

**Yes.** Static hosting (S3 + CloudFront only) cannot run this site, because:

- ISR pages (`revalidate = 300`) are regenerated on the server.
- `/api/events`, `/api/courses` and `/api/gallery/*` hold the logout.world keys and S3 access on the server, and must not move to the browser.
- `/_next/image` resizes images to AVIF/WebP at request time.
- Redirects include host-based rules (old subdomains).

## 2. Recommended architecture

```
Route 53 (or current DNS) ─► CloudFront (ACM cert, us-east-1) ─► App Runner service (container, ap-south-1)
                                                               │      ├─ IAM instance role → S3 gallery bucket (read)
                                                               │      ├─ Secrets: EVENTS_API_KEY, COURSES_API_KEY
                                                               │      └─ Logs/metrics → CloudWatch
                                                               └─► logout.world (stays external)
```

| Service | Use | Why |
|---|---|---|
| **AWS App Runner** | Runs the Docker image (`node server.js`) | Managed container with HTTPS, autoscaling and health checks; no cluster to run. **Check that App Runner is offered in your chosen region before you start**; if it isn't, use ECS Fargate + ALB with the same image |
| ECS Fargate + ALB | Alternative | More control (VPC, WAF on the ALB, fixed instance counts) at more setup cost |
| Amplify Hosting | Not chosen | It supports Next.js SSR, but you would need to confirm Amplify support for **Next.js 16** before relying on it |
| Lambda / API Gateway | Not chosen | Would need an adapter (e.g. OpenNext). Extra moving parts for no clear gain at this traffic |
| **CloudFront** | CDN, TLS for the custom domain, caching | Caches `/_next/static`, images and the 5-minute API answers near visitors |
| **ACM** | Certificate for `www.bondsafarikovalam.com` (+ bare domain) | Must be in **us-east-1** for CloudFront |
| **Route 53** | DNS | Optional. Only needed if you move DNS from the current provider; an `ALIAS`/`CNAME` to CloudFront works anywhere |
| **Secrets Manager / SSM** | `EVENTS_API_KEY`, `COURSES_API_KEY` | App Runner can inject them as environment variables |
| **CloudWatch** | Logs, alarms | App Runner ships stdout/stderr; see §8 |

The logout.world APIs **stay external**. The server calls them over HTTPS, and the browser loads only the checkout embed from
logout.world. No CORS configuration is needed on AWS: the browser calls only same-origin `/api/*`.

## 3. Build

| Item | Value |
|---|---|
| Install | `npm ci` |
| Build | `npm run build` (`next build`, with `output: 'standalone'`) |
| Output | `.next/standalone/` (server + traced node_modules) + `.next/static/` + `public/` |
| Start | `node server.js` (in the standalone folder), port `PORT` (3000), host `HOSTNAME=0.0.0.0` |
| Node | 22 LTS (the image uses `node:22-alpine`; the AWS SDK will require Node ≥ 22 for releases from January 2027) |
| Health check | `GET /api/health` → `200 {"ok":true}` (no upstream calls) |

The `Dockerfile` in the repo does all of this:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SITE_URL=https://www.bondsafarikovalam.com \
  --build-arg NEXT_PUBLIC_TAWK_PROPERTY_ID=… --build-arg NEXT_PUBLIC_TAWK_WIDGET_ID=… \
  -t bondsafari-web .
docker run -p 3000:3000 --env-file .env.production bondsafari-web     # local smoke test
```

> ⚠️ The Docker image build has **not been run** yet (Docker Desktop was not running during this audit). Run the smoke test above
> before pushing to ECR.

**Build-time API data.** If the logout.world keys are absent during `docker build`, pre-rendered pages are built from the
static catalogue in `data/` and refresh from the API on the first visit after 5 minutes. To pre-render with live data, pass the
keys as BuildKit secrets. Never pass them as `ARG`, because build args stay in the image history.

## 4. Environment variables

| Variable | When read | Where to set | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **build** | build arg | `https://www.bondsafarikovalam.com`; used for canonical, sitemap, OG |
| `NEXT_PUBLIC_EVENTS_MEDIA_BASE_URL` | build | build arg | default `https://logout.world/media` |
| `NEXT_PUBLIC_TAWK_PROPERTY_ID`, `NEXT_PUBLIC_TAWK_WIDGET_ID` | build | build arg | public by design |
| `EVENTS_API_URL` | runtime | App Runner env | default `https://logout.world/api/company/events/` |
| `EVENTS_API_KEY`, `COURSES_API_KEY` | runtime | **Secrets Manager** | server-only |
| `S3_REGION`, `S3_BUCKET` | runtime | App Runner env | gallery bucket |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | runtime | **leave unset on AWS** | the instance role is used instead (see §5) |
| `SITE_NOINDEX` | build + runtime | staging only | `true` → robots disallow + `X-Robots-Tag: noindex` |
| `BOOKING_API_URL`, `BOOKING_API_KEY` | runtime | optional | only for `/api/brochure` lead storage; not configured today |

`VERCEL` must **not** be set on AWS, so Vercel Analytics stays off.

## 5. IAM

App Runner **instance role** with read access to the gallery prefix only:

```json
{ "Version": "2012-10-17", "Statement": [
  { "Effect": "Allow", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::<S3_BUCKET>/gallery/*" } ] }
```

App Runner **access role** for pulling the image from ECR (`AWSAppRunnerServicePolicyForECRAccess`).
Once the role works, retire the static S3 keys that are in use on Vercel today.

## 6. CloudFront behaviours

| Path | Cache policy | Notes |
|---|---|---|
| `/_next/static/*` | CachingOptimized | Files are content-hashed and `immutable` |
| `/_next/image*` | Cache on query string (`url`, `w`, `q`) + `Accept` header | So AVIF/WebP variants are cached separately |
| `/images/*`, `/videos/*` | Use origin headers | Origin sends 1 week |
| `/api/health` | CachingDisabled | |
| `/api/*` | Use origin headers | events/courses send `s-maxage=300`; `/api/brochure` is POST, so allow POST and don't cache |
| Default `*` | Use origin `Cache-Control` | ISR pages send `s-maxage`/`stale-while-revalidate`; forward the query string |

- **Host header:** App Runner expects its own host. Send its default domain as the origin host, and attach the custom domain
  on CloudFront. The host-based redirects for the old `bookings.` / `courses.` subdomains in `redirects.mjs` then never match. Do
  those two redirects as a **CloudFront Function** on the subdomains' distribution, or point those subdomains at the
  App Runner custom domain directly.
- **Bare domain → www:** CloudFront Function (301) or a small S3 redirect bucket; the app does not do it.
- Viewer protocol: redirect HTTP → HTTPS. The app already sends HSTS.
- Optional: AWS WAF managed rules on the distribution.

## 7. ISR and caching on multiple instances

- The ISR cache and the logout.world memory cache live **per instance** and reset on deploy. With a 5-minute revalidate, instances
  can differ for up to 5 minutes. That is fine for this content, so no shared cache is needed.
- Keep **min instances = 1** (App Runner) so the memory cache stays warm. The first view of an API-only page then takes ~2 s,
  and later views take milliseconds.
- If logout.world is down, each instance keeps serving its last good copy. A freshly started instance during an outage shows the
  static catalogue instead.

## 8. Monitoring (CloudWatch)

- Log group from App Runner. Create metric filters for `Events API:` and `Checkout catalog:` (upstream failures) and `gallery S3 read failed`.
- Alarms: 5xx rate > 1 % for 5 min, p95 latency > 2 s, health-check failures, an `Events API` error count above 0 for 15 min.
- Optional: CloudWatch Synthetics canary on `/`, `/activities`, `/courses`, `/api/health`.

## 9. Security follow-ups

- **Content-Security-Policy:** start with `Content-Security-Policy-Report-Only` that allows `self`, `logout.world` (script,
  frame, img, connect), `embed.tawk.to` and `*.tawk.to` (script, connect, frame, wss), Google Maps (frame) and YouTube (frame) if used.
  Enforce it once the reports are clean.
- Rate-limit `POST /api/brochure` (WAF rate rule) if lead storage is turned on.
- Rotate the S3 keys that were used on Vercel after moving to the IAM role.

## 10. Cut-over checklist

1. Build the image, run the local smoke test, push to ECR.
2. Create the App Runner service: port 3000, health check `/api/health`, env vars and secrets, instance role, min 1 instance.
3. Test on the App Runner URL with `SITE_NOINDEX=true`, then rebuild without it for production.
4. CloudFront + ACM; test through the CloudFront domain.
5. Lower the DNS TTL a day before; switch `www` (and the bare domain) to CloudFront.
6. Verify: 308s for old URLs, `/sitemap.xml`, `/robots.txt`, gallery images, the Book now checkout, the tawk chat (check the
   tawk domain allow-list), WhatsApp/phone links.
7. Submit the sitemap in Search Console and Bing; keep the old WordPress host available for a rollback window.
