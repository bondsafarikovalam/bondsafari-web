import type { PDFFont } from 'pdf-lib'
import type { DetailItem } from '@/components/pages/detail'
import { contact } from '@/data/site'

const page = { width: 595.28, height: 841.89, margin: 48, footer: 64 }
const band = 196

// The PDF's built-in fonts only cover Western characters, so ₹ is spelled out and anything else outside them is dropped
const clean = (s: string) => s.replace(/₹\s*/g, 'Rs. ').replace(/\s+/g, ' ').replace(/[^\x20-\x7E\xA0-\xFF–—‘’“”•…]/g, '').trim()

const wrap = (value: string, font: PDFFont, size: number, max: number) => clean(value).split(' ').reduce<string[]>((lines, word) => {
  const line = lines[lines.length - 1]
  if (line !== undefined && font.widthOfTextAtSize(`${line} ${word}`, size) <= max) lines[lines.length - 1] = `${line} ${word}`
  else lines.push(word)
  return lines
}, [])

// A brochure made from what the page itself shows, for products with no designed PDF yet.
// pdf-lib is loaded here rather than at the top so it only reaches browsers that ask for a brochure
export async function brochurePdf(item: DetailItem) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
  const ocean = rgb(0.03, 0.176, 0.227), teal = rgb(0.07, 0.42, 0.44), ink = rgb(0.22, 0.27, 0.28), sand = rgb(0.86, 0.76, 0.6), white = rgb(1, 1, 1)
  const pdf = await PDFDocument.create()
  pdf.setTitle(clean(`${item.title} | Bond Safari`))
  pdf.setAuthor('Bond Safari Kovalam')
  const [sans, bold, serif] = await Promise.all([pdf.embedFont(StandardFonts.Helvetica), pdf.embedFont(StandardFonts.HelveticaBold), pdf.embedFont(StandardFonts.TimesRoman)])
  const width = page.width - page.margin * 2

  let sheet = pdf.addPage([page.width, page.height])
  sheet.drawRectangle({ x: 0, y: page.height - band, width: page.width, height: band, color: ocean })
  sheet.drawText('BOND SAFARI  ·  KOVALAM, KERALA', { x: page.margin, y: page.height - 54, size: 9, font: bold, color: sand })
  let y = page.height - 96
  for (const line of wrap(item.title, serif, 32, width).slice(0, 2)) { sheet.drawText(line, { x: page.margin, y, size: 32, font: serif, color: white }); y -= 36 }
  if (item.tagline) for (const line of wrap(item.tagline, sans, 12, width).slice(0, 2)) { sheet.drawText(line, { x: page.margin, y: y + 8, size: 12, font: sans, color: white }); y -= 16 }
  y = page.height - band - 34

  const room = (needed: number) => {
    if (y - needed >= page.footer) return
    sheet = pdf.addPage([page.width, page.height])
    y = page.height - page.margin
  }
  const text = (value: string, indent = 0) => {
    for (const line of wrap(value, sans, 10.5, width - indent)) {
      room(15)
      sheet.drawText(line, { x: page.margin + indent, y, size: 10.5, font: sans, color: ink })
      y -= 15
    }
  }
  const heading = (value: string) => {
    room(52)
    y -= 12
    sheet.drawText(clean(value), { x: page.margin, y, size: 16, font: serif, color: teal })
    y -= 22
  }
  const facts = (rows: [string, string][]) => rows.forEach(([label, value]) => {
    room(17)
    sheet.drawText(clean(label).toUpperCase(), { x: page.margin, y, size: 8, font: bold, color: teal })
    const lines = wrap(value, sans, 10.5, width - 130)
    lines.forEach((line, i) => {
      sheet.drawText(line, { x: page.margin + 130, y, size: 10.5, font: sans, color: ink })
      if (i < lines.length - 1) { y -= 15; room(15) }
    })
    y -= 19
  })

  facts([['Duration', item.duration], ['Price', item.price ?? 'Contact for price'], ...(item.location ? [['Location', item.location] as [string, string]] : []), ...(item.requirements ?? [])])
  const about = item.overview?.length ? item.overview : item.description ? [item.description] : []
  if (about.length) { heading('About'); about.forEach(p => { text(p); y -= 7 }) }
  if (item.details?.length) {
    heading('What’s included')
    item.details.forEach(d => {
      room(15)
      sheet.drawText('•', { x: page.margin, y, size: 10.5, font: bold, color: teal })
      text(d, 14)
      y -= 3
    })
  }

  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.bondsafarikovalam.com').replace(/^https?:\/\//, '')
  for (const each of pdf.getPages()) {
    each.drawLine({ start: { x: page.margin, y: 46 }, end: { x: page.width - page.margin, y: 46 }, thickness: 0.5, color: sand })
    each.drawText(clean(`${contact.phones[0]}  ·  ${contact.email}  ·  ${site}`), { x: page.margin, y: 32, size: 8.5, font: sans, color: ink })
  }
  return pdf.save()
}
