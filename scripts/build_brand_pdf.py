"""
Generate the EarnedStar Brand Guidelines PDF.
Run: python scripts/build_brand_pdf.py
Output: frontend/public/brand-guidelines.pdf
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor, white
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RENDERS = os.path.join(ROOT, "frontend", "public", "meshy-renders")
OUT = os.path.join(ROOT, "frontend", "public", "brand-guidelines.pdf")

INK = HexColor("#0B1A38")
GOLD = HexColor("#92400E")
GOLD_LIGHT = HexColor("#F59E0B")
CREAM = HexColor("#F7F4EE")
VELLUM = HexColor("#F2EBDC")
MUTED = HexColor("#5B6985")

W, H = letter
M = 0.6 * inch  # margin


def smallcaps(c, text, x, y, size=8, color=MUTED, kerning=2):
    c.setFont("Helvetica-Bold", size)
    c.setFillColor(color)
    try:
        c.setCharSpace(kerning)
    except AttributeError:
        c._charSpace = kerning
    c.drawString(x, y, text.upper())
    try:
        c.setCharSpace(0)
    except AttributeError:
        c._charSpace = 0


def heading(c, text, x, y, size=42, color=INK):
    c.setFont("Times-Italic", size)
    c.setFillColor(color)
    c.drawString(x, y, text)


def body(c, text, x, y, size=10, color=INK, leading=14, max_chars=92):
    c.setFont("Helvetica", size)
    c.setFillColor(color)
    # naive word wrap
    words = text.split()
    line = ""
    for w in words:
        if len(line) + len(w) + 1 > max_chars:
            c.drawString(x, y, line.strip())
            y -= leading
            line = w + " "
        else:
            line += w + " "
    if line.strip():
        c.drawString(x, y, line.strip())
        y -= leading
    return y


def rule(c, x1, x2, y, color=INK, w=0.8):
    c.setStrokeColor(color)
    c.setLineWidth(w)
    c.line(x1, y, x2, y)


def page_chrome(c, page_num, total):
    # top masthead
    rule(c, M, W - M, H - M, color=INK, w=1.2)
    smallcaps(c, "EarnedStar — Brand Guidelines", M, H - M + 6)
    smallcaps(c, f"Vol. 01 · Edition I", W - M - 1.5 * inch, H - M + 6)
    # bottom imprint
    rule(c, M, W - M, M - 6)
    smallcaps(c, "Published Jan 2026", M, M - 18)
    smallcaps(c, f"Page {page_num:02d} of {total:02d}", W - M - 1.2 * inch, M - 18)


# ============ COVER ============
c = canvas.Canvas(OUT, pagesize=letter)
TOTAL = 8

# Cover gold border
c.setStrokeColor(GOLD_LIGHT)
c.setLineWidth(2.5)
c.rect(M - 6, M - 6, W - 2 * M + 12, H - 2 * M + 12, stroke=1, fill=0)

# masthead
smallcaps(c, "A Trust Manifesto · Brand Guidelines · Edition I", M + 4, H - M - 24, size=9, color=GOLD)

# brand hero image
hero = os.path.join(RENDERS, "render_76cbc33016.png")
if os.path.exists(hero):
    c.drawImage(hero, M + 1 * inch, H - 5.6 * inch, width=W - 2 * M - 2 * inch, height=3.2 * inch,
                preserveAspectRatio=True, mask='auto')

heading(c, "The brand", M + 4, H - 6.4 * inch, size=64)
c.setFont("Times-Italic", 64)
c.setFillColor(GOLD)
c.drawString(M + 4, H - 7.2 * inch, "guidelines.")

body(c, "Every promise rendered. Every mark explained. Every star earned. "
        "This is the official Edition I usage and visual standards document for the EarnedStar identity system — "
        "leather, gold, light, and the publication of trust.",
     M + 4, H - 7.8 * inch, size=12, leading=17, color=INK, max_chars=70)

smallcaps(c, "EarnedStar · 2026 · Published Jan 2026", M + 4, M + 0.4 * inch, color=MUTED, size=9)
c.showPage()


# ============ PAGE 2 — THE MARK ============
page_chrome(c, 2, TOTAL)
smallcaps(c, "Chapter 01 · The Mark", M, H - M - 24, color=GOLD)
heading(c, "The leather lucky star.", M, H - M - 72, size=38)
body(c, "EarnedStar's primary mark is a five-pointed padded-leather star with hand-stitched gold piping and a central oval medallion ringed in gold. "
        "The medallion holds the merchant's logo — making every badge a verified introduction, not a generic stamp.",
     M, H - M - 110, size=11, leading=16, max_chars=80)

# featured render
star = os.path.join(RENDERS, "render_45d84d1e36.png")
if os.path.exists(star):
    c.drawImage(star, M, H - M - 380, width=3.2 * inch, height=3.0 * inch, preserveAspectRatio=True, mask='auto')

# spec panel
spec_x = M + 3.6 * inch
spec_y = H - M - 130
specs = [
    ("Material", "Padded leather (3D rendered)"),
    ("Stitching", "Gold contrast, ~2 mm gauge"),
    ("Medallion", "Oval, gold ring, ovate slot"),
    ("Variants", "Navy/Gold · All Gold · All White"),
    ("File formats", "PNG · SVG · Lottie · 3D mesh"),
    ("Maximum scale", "Unlimited (vector)"),
    ("Minimum scale", "24 px (digital), 12 mm (print)"),
]
for k, v in specs:
    smallcaps(c, k, spec_x, spec_y, color=GOLD, size=8)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(INK)
    c.drawString(spec_x, spec_y - 14, v)
    rule(c, spec_x, spec_x + 2.6 * inch, spec_y - 22, color=HexColor("#E0DFD9"))
    spec_y -= 38

c.showPage()


# ============ PAGE 3 — CLEAR SPACE ============
page_chrome(c, 3, TOTAL)
smallcaps(c, "Chapter 02 · Clear Space", M, H - M - 24, color=GOLD)
heading(c, "Give the mark room to breathe.", M, H - M - 72, size=34)
body(c, "Maintain a minimum clear-space margin around the mark equal to the height of the medallion (defined as X). "
        "Never crowd the mark with other graphics, text, or boundaries inside this protective zone.",
     M, H - M - 110, size=11, leading=16, max_chars=80)

# diagram
diag_x = M + 0.6 * inch
diag_y = H - M - 460
mark_size = 2.0 * inch
X = 0.55 * inch  # one X unit

# protective zone (gold dashed)
c.setStrokeColor(GOLD_LIGHT)
c.setDash(4, 4)
c.setLineWidth(1.2)
c.rect(diag_x - X, diag_y - X, mark_size + 2 * X, mark_size + 2 * X, stroke=1, fill=0)
c.setDash()

# mark placeholder
if os.path.exists(star):
    c.drawImage(star, diag_x, diag_y, width=mark_size, height=mark_size, preserveAspectRatio=True, mask='auto')

# X labels
smallcaps(c, "X = medallion height", diag_x + mark_size + 0.6 * inch, diag_y + mark_size + 0.4 * inch, color=GOLD, size=9)
c.setFont("Helvetica", 10)
c.setFillColor(MUTED)
c.drawString(diag_x + mark_size + 0.6 * inch, diag_y + mark_size + 0.2 * inch, "Clear space on all sides ≥ X")
c.drawString(diag_x + mark_size + 0.6 * inch, diag_y + mark_size, "Use 2X in print or large-format contexts")

# minimum size sidebar
mx, my = W - M - 2.5 * inch, H - M - 260
smallcaps(c, "Minimum sizes", mx, my, color=GOLD, size=10)
data = [
    ("Digital — primary", "32 px height"),
    ("Digital — favicon", "16 × 16 px (SVG only)"),
    ("Print — primary", "12 mm height"),
    ("Embroidery / patch", "25 mm height"),
    ("Vehicle / signage", "60 mm height"),
]
my -= 20
for k, v in data:
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(INK)
    c.drawString(mx, my, k)
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawString(mx, my - 12, v)
    rule(c, mx, mx + 2.4 * inch, my - 20, color=HexColor("#E0DFD9"))
    my -= 30

c.showPage()


# ============ PAGE 4 — COLOR ============
page_chrome(c, 4, TOTAL)
smallcaps(c, "Chapter 03 · Color", M, H - M - 24, color=GOLD)
heading(c, "Navy, gold, and the cream in between.", M, H - M - 72, size=32)

# swatches
sw_y = H - M - 200
swatches = [
    ("Ink Navy", "#0B1A38", "RGB 11/26/56", "Primary — backgrounds, type", INK),
    ("Imperial Gold", "#F59E0B", "RGB 245/158/11", "Accent — emphasis, foil", GOLD_LIGHT),
    ("Burnished Gold", "#92400E", "RGB 146/64/14", "Accent dark — type on cream", GOLD),
    ("Cream", "#F7F4EE", "RGB 247/244/238", "Light surface backgrounds", CREAM),
    ("Vellum", "#F2EBDC", "RGB 242/235/220", "Manifesto sections, paper", VELLUM),
]
for i, (name, hex_, rgb, use, color) in enumerate(swatches):
    sx = M + i * 1.42 * inch
    c.setFillColor(color)
    c.rect(sx, sw_y, 1.25 * inch, 1.25 * inch, stroke=0, fill=1)
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(INK)
    c.drawString(sx, sw_y - 14, name)
    c.setFont("Courier", 8)
    c.setFillColor(MUTED)
    c.drawString(sx, sw_y - 26, hex_)
    c.drawString(sx, sw_y - 36, rgb)
    c.setFont("Helvetica", 8)
    c.drawString(sx, sw_y - 50, use[:24])

# gold foil note
sw_y2 = sw_y - 1.4 * inch
smallcaps(c, "Gold Foil — Edition I", M, sw_y2, color=GOLD)
body(c, "For premium award medallions and Quarterly Leaders, render gold as a 135° gradient: "
        "#FDE68A → #F59E0B (50%) → #92400E (100%). Use the gold-foil animation (8s ease cycle) on web only.",
     M, sw_y2 - 18, size=10, leading=14, max_chars=88)

c.showPage()


# ============ PAGE 5 — TYPOGRAPHY ============
page_chrome(c, 5, TOTAL)
smallcaps(c, "Chapter 04 · Typography", M, H - M - 24, color=GOLD)
heading(c, "Instrument Serif. Plus Jakarta. JetBrains.", M, H - M - 76, size=28)

ty = H - M - 130

# display
smallcaps(c, "Display & Editorial", M, ty, color=GOLD)
c.setFont("Times-Italic", 36)
c.setFillColor(INK)
c.drawString(M, ty - 36, "Reviews that earned")
c.setFont("Times-Italic", 36)
c.setFillColor(GOLD)
c.drawString(M, ty - 70, "their place.")
c.setFont("Helvetica", 9)
c.setFillColor(MUTED)
c.drawString(M, ty - 90, "Instrument Serif · Italic · 36–96 px headings · always pairs with hand-drawn gold underline on emphasis words")

# body
ty2 = ty - 130
smallcaps(c, "Body & UI", M, ty2, color=GOLD)
c.setFont("Helvetica", 12)
c.setFillColor(INK)
c.drawString(M, ty2 - 22, "Plus Jakarta Sans · 400 / 600 / 800 — body, UI controls, paragraph text.")
c.setFont("Helvetica", 9)
c.setFillColor(MUTED)
c.drawString(M, ty2 - 38, "Tracking -0.01em on headings · line-height 1.55–1.65 · text-balance + text-pretty on display")

# numeric
ty3 = ty2 - 80
smallcaps(c, "Numeric & Data", M, ty3, color=GOLD)
c.setFont("Courier-Bold", 22)
c.setFillColor(INK)
c.drawString(M, ty3 - 32, "142,847  ·  $99/mo  ·  22H SLA")
c.setFont("Helvetica", 9)
c.setFillColor(MUTED)
c.drawString(M, ty3 - 52, "JetBrains Mono · tabular-nums · -0.02em letter-spacing · always for counters, prices, metrics")

# smallcaps
ty4 = ty3 - 90
smallcaps(c, "Small Caps · Editorial Labels", M, ty4, color=GOLD)
smallcaps(c, "Editor's Note · Chapter 01 · Vol. 01 · 2026", M, ty4 - 22, color=INK, size=10, kerning=2.5)
c.setFont("Helvetica", 9)
c.setFillColor(MUTED)
c.drawString(M, ty4 - 38, "Plus Jakarta 700 · 16% letter-spacing · used for section labels, dates, classifications")

c.showPage()


# ============ PAGE 6 — DO / DON'T ============
page_chrome(c, 6, TOTAL)
smallcaps(c, "Chapter 05 · Do & Don't", M, H - M - 24, color=GOLD)
heading(c, "Respect the mark.", M, H - M - 72, size=36)

# Do column
do_x = M
dont_x = M + 3.6 * inch
gy = H - M - 130

smallcaps(c, "DO", do_x, gy, color=HexColor("#15803D"), size=12)
do_items = [
    "Use the official renders from the brand library",
    "Maintain clear space ≥ X around the mark",
    "Pair the wordmark with the leather star at small sizes",
    "Use Imperial Gold for emphasis on emphasis words only",
    "Apply the hand-drawn underline to italic emphasis",
    "Preserve the gold-ring medallion in all colorways",
    "Use Plus Jakarta + Instrument Serif together",
    "Tag every photo of merchant adoption with #EarnedStar",
]

dy = gy - 24
for item in do_items:
    c.setFillColor(HexColor("#15803D"))
    c.circle(do_x + 4, dy + 3, 3, stroke=0, fill=1)
    c.setFont("Helvetica", 10)
    c.setFillColor(INK)
    c.drawString(do_x + 14, dy, item)
    dy -= 18

smallcaps(c, "DON'T", dont_x, gy, color=HexColor("#B91C1C"), size=12)
dont_items = [
    "Re-render the star in different geometry or texture",
    "Use the mark on busy photographic backgrounds",
    "Stretch, skew, or rotate the mark",
    "Recolor leather to non-approved palettes",
    "Replace Instrument Serif with similar serifs",
    "Use neon gold or chrome effects — only matte foil",
    "Combine with competing review-platform logos",
    "Use the wordmark vertically or in all caps",
]

dy = gy - 24
for item in dont_items:
    c.setFillColor(HexColor("#B91C1C"))
    c.line(dont_x + 1, dy + 3, dont_x + 7, dy + 3)
    c.line(dont_x + 1, dy + 3, dont_x + 4, dy + 6)
    c.line(dont_x + 1, dy + 3, dont_x + 4, dy + 0)
    c.setFont("Helvetica", 10)
    c.setFillColor(INK)
    c.drawString(dont_x + 14, dy, item)
    dy -= 18

c.showPage()


# ============ PAGE 7 — VARIANTS GALLERY ============
page_chrome(c, 7, TOTAL)
smallcaps(c, "Chapter 06 · The Library", M, H - M - 24, color=GOLD)
heading(c, "Twenty-one renders. One identity.", M, H - M - 72, size=28)
body(c, "Every render in the EarnedStar system, available at earnedstar.com/brand. "
        "Use the asset library to download PNG, copy CDN URLs, or request an SVG variant.",
     M, H - M - 100, size=10, leading=14, max_chars=80)

# 6 thumbnails
thumbs = [
    "render_03ad263cd8.png",
    "render_47069cba2c.png",
    "render_d0e706d76b.png",
    "render_16b7e72831.png",
    "render_c6d95bea43.png",
    "render_c30552e25d.png",
]
labels = ["Hero", "Brand System", "Q1 Leader Award", "Verified Human", "Merchant Card", "Rating Badge"]

th_w = 2.1 * inch
th_h = 1.6 * inch
ty = H - M - 280
for i, (tf, lbl) in enumerate(zip(thumbs, labels)):
    col = i % 3
    row = i // 3
    tx = M + col * (th_w + 0.2 * inch)
    tyy = ty - row * (th_h + 0.6 * inch)
    p = os.path.join(RENDERS, tf)
    if os.path.exists(p):
        c.setStrokeColor(HexColor("#E0DFD9"))
        c.setLineWidth(0.5)
        c.rect(tx, tyy, th_w, th_h, stroke=1, fill=0)
        c.drawImage(p, tx + 4, tyy + 4, width=th_w - 8, height=th_h - 8,
                    preserveAspectRatio=True, mask='auto')
    smallcaps(c, lbl, tx, tyy - 14, size=8, color=GOLD)

c.showPage()


# ============ PAGE 8 — IMPRINT ============
page_chrome(c, 8, TOTAL)
heading(c, "Imprint.", M, H - 2.5 * inch, size=64, color=INK)
smallcaps(c, "Published by EarnedStar — January 2026", M, H - 2.9 * inch, color=GOLD, size=10)

body(c, "These guidelines are Edition I of an evolving document. Updated quarterly with feedback from agency partners, "
        "press contacts, and the merchants who carry the EarnedStar mark on their storefronts.",
     M, H - 3.6 * inch, size=11, leading=17, max_chars=78)

smallcaps(c, "Contact", M, H - 5.0 * inch, color=GOLD)
c.setFont("Helvetica", 11)
c.setFillColor(INK)
c.drawString(M, H - 5.2 * inch, "brand@earnedstar.com")
c.drawString(M, H - 5.5 * inch, "earnedstar.com/brand")

smallcaps(c, "Vol. 01 · Edition I · 2026", M, H - 6.5 * inch, color=MUTED, size=10)

c.setFont("Times-Italic", 18)
c.setFillColor(GOLD)
c.drawString(M, M + 0.6 * inch, "Verified · Auditable · Portable · Fair")

c.showPage()
c.save()

print(f"Wrote {OUT}")
