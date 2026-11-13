# Bond Safari – Final Production Audit

Branch `chore/aws-production-readiness` (from `feat/BS-02` @ `a5adb21`). Uncommitted; nothing deployed.

## Final verification (all actually executed on 2026-11-12)

| # | Check | Result |
|---|---|---|
| 1 | Production build (`next build`) | ✅ Pass, exit 0 |
| 2 | Lint (`npm run lint`) | ✅ 0 errors, 0 warnings |
| 3 | Type check (`npm run typecheck`) | ✅ Pass |
| 4 | Automated tests | ⚠️ The repo has no test suite. Executed instead: route crawl (114 URLs), headless-Chrome layout test (88 page × width runs), API outage test, Web Vitals lab run |
| 5 | Major routes | ✅ Home, Activities, Courses, activity and course details, About, Gallery, Blog, News, FAQ, Contact, landing pages: all 200 |
| 6 | Both main APIs | ✅ `/api/events`: 13 activities on page 1 of 3 (courses filtered out); `/api/courses`: 12 courses (11 bookable) |
| 7 | Image loading | ✅ No broken images in 88 runs; API cover images from logout.world; gallery from S3 |
| 8 | Responsive | ✅ No horizontal scroll at 320/360/375/390/414/768/1024/1440 on 11 pages |
| 9 | SEO files | ✅ `robots.txt`, `sitemap.xml` (114 URLs), canonical/OG/JSON-LD, 308 legacy redirects |
| 10 | AWS compatibility | ✅ Standalone server runs, health check, IAM-role S3, no Vercel-only runtime dependency. ⚠️ Docker image build not run |

Links: WhatsApp (`wa.me/918448448846`) and `tel:` links are present in the header bar, footer and pages. Their targets are correct
in the HTML; the actual dial and chat open were not tested from a phone.

## Acceptance criteria

| Criterion | Status |
|---|---|
| Fully functional | ✅ All routes render; booking opens the logout.world checkout (unchanged) |
| Free from known critical errors | ✅ The critical redirect gap (C1) and the critical vulnerability are fixed |
| API integrated correctly | ✅ Server-only keys, cached, survives upstream outage |
| Optimised for fast loading | ⚠️ TTFB fixed (seconds → ms); LCP is over target on Home (3.5 s) and slightly over on Activities/Courses (~2.6 s) in the slow-mobile lab run |
| Mobile responsive | ✅ |
| SEO optimised | ✅ Technical SEO is complete; business facts (rating, registration, privacy page) are pending |
| Secure | ✅ Headers, 0 production vulnerabilities, no leaked secrets; CSP pending |
| Accessible | ✅ Basic checks pass (alt, headings, labels, ARIA lint); no full WCAG audit done |
| AWS deployment ready | ✅ Artifact and guide ready; image build to be smoke-tested |

## Remaining before go-live

| Priority | Item | Owner |
|---|---|---|
| High | Run `docker build` + local `docker run` smoke test (not executed in this audit) | Dev |
| High | Home LCP (3.5 s) / TBT (600 ms): defer the hero video, reduce home hydration. Activities/Courses hero text animation (~2.6 s LCP) | Dev + design approval |
| High | Business-fact sign-off in `docs/launch-checklist.md` (PADI 5★ IDC claim, ASAP loan, placement claim, minimum ages, IDC duration). FAQ vs site mismatch: parasailing age 8 vs 10, DSD 4 h vs 2.5–3 h | Bond Safari |
| High | Add the remaining courses to the logout.world checkout widget (it lists only Rescue, Zero to Hero, IDC); otherwise "Book now" on other courses opens a checkout without them | Bond Safari (logout.world dashboard) |
| Medium | Privacy policy / terms page | Bond Safari + Dev |
| Medium | CSP in report-only mode, then enforce | Dev |
| Medium | Check tawk.to on the production domain (blocked by CORS on localhost) | Dev |
| Medium | `COURSES_API_KEY` currently returns 0 courses; courses come from the Bond Safari events list. Confirm this is intended | Bond Safari / logout.world |
| Low | Brochure lead storage needs `BOOKING_API_URL`, otherwise leads are not saved (the guest still gets the PDF) | Decision |
| Low | Remove leftover booking-flow code (`lib/booking/cart.ts` mostly unused, `lib/i18n.ts`) | Dev |
| Low | Add a Playwright smoke suite to CI using the same routes as the crawl | Dev |

## Verdict

# READY AFTER REMAINING FIXES

The codebase is AWS-deployable and the critical issues are fixed and verified. Two things block "ready": the Docker image
build has not been smoke-tested, and home-page LCP is still over target. The content sign-offs above should be done before the
public cut-over.
