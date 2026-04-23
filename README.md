#  Café Website

---

## English

### About the Project

A complete, production-ready, multi-page website for **Brew & Soul** — a specialty café at 12 Nile Street, Downtown Cairo. The site features bilingual Arabic/English support with full RTL layout, a warm dark mode, Egyptian Pound pricing, a shopping cart with FormSubmit order delivery, and a clean premium design system.

### Features

| Feature | Details |
|---|---|
| 🌐 **5 Pages** | Home, Menu, Our Story, Reservations, Contact |
| 🔤 **Bilingual** | Arabic / English toggle with full RTL, `localStorage` persistence |
| 🌙 **Dark Mode** | Warm espresso palette (`#1a1714` → `#ede8e3`), class-based |
| 🛒 **Shopping Cart** | Floating cart on Menu page, FormSubmit order delivery |
| 📧 **Reservation Form** | Client-side validation + FormSubmit to `wahadmomo@gmail.com` |
| 💰 **EGP Pricing** | All prices in `ج.م` format, DM Mono font |
| 📱 **Responsive** | Mobile-first, works at 390px, 768px, 1440px |
| 🧭 **Active Nav** | JS auto-highlights the current page in the navbar |

---

### File Structure

```
brew-soul-website/
├── index.html                    → Home page
├── pages/
    ├── menu/index.html           → Menu page (+ cart)
    ├── story/index.html          → Our Story page
    ├── reservation/index.html    → Book a Table page
    └── contact/index.html        → Contact & Visit Us page
├── assets/
    ├── css/
    │   └── shared.css            → Global CSS: dark mode, navbar, cart, RTL, toast
    └── js/
        ├── main.js               → Theme, language, nav, toast, AOS
        └── menu-filter.js        → Menu filter, cart logic, FormSubmit, FAQ, counter
├── design-source/                → Original reference HTML (do not edit)
└── README.md
```

---

### How to Run

> **No build step required.**

```bash
# Option 1 — double-click index.html
# Option 2 — VS Code Live Server extension
# Option 3 — local server
npx serve .
```

---

## 📧 FormSubmit Integration

The forms on this website use [FormSubmit](https://formsubmit.co) to send submissions to `wahadmomo@gmail.com`.

### Important Notes:
1. **Activation:** The first time a form is submitted, FormSubmit will send an activation email to `wahadmomo@gmail.com`. You **must** click the link in that email to start receiving submissions.
2. **AJAX Submission:** All forms use AJAX (fetch) to submit data without reloading the page.
3. **No Keys Required:** Unlike EmailJS, FormSubmit does not require any Public Keys or Service IDs.

---

### Design System — Color Tokens

#### Light Mode
| Token | Value |
|---|---|
| `primary-container` | `#2c1810` (espresso) |
| `secondary` | `#735a36` (caramel gold) |
| `surface` | `#fcf9f4` (warm white) |
| `background` | `#fcf9f4` |
| `on-surface` | `#1c1c19` |
| `outline-variant` | `#d3c3be` |

#### Dark Mode (warm espresso palette)
| Token | Value |
|---|---|
| `--dm-bg` | `#1a1714` (deep espresso) |
| `--dm-surface` | `#231f1c` (dark roast) |
| `--dm-surface-mid` | `#2e2925` (roast brown) |
| `--dm-text` | `#ede8e3` (warm cream) |
| `--dm-text-muted` | `#c9bbb5` |
| `--dm-gold` | `#c8a97e` (warm gold) |
| `--dm-outline` | `#4a3f39` |

---

### Typography

| Role | Font | Usage |
|---|---|---|
| Headlines | Cormorant Garamond | `font-headline`, all `h1`–`h6` |
| Body | Outfit | Paragraphs, labels |
| Monospace | DM Mono | Prices (`ج.م`), nav links, buttons |
| Arabic body | Tajawal | Applied via `[lang="ar"]` selector |

---

### Pages Reference

| Route | Page | Key Features |
|---|---|---|
| `/index.html` | Home | Featured drinks with auto-add, curated sections, testimonials |
| `/pages/menu/index.html` | Menu | Filter tabs, coffee selection, cart FAB, cart drawer |
| `/pages/story/index.html` | Our Story | Image split, foundational genesis story |
| `/pages/reservation/index.html` | Reservations | Centered premium form + validation + success state |
| `/pages/contact/index.html` | Contact | Form, Visit Us card, FAQ accordion |

---

### Customization Guide

#### Add a new language string
Add `data-en="English text"` and `data-ar="نص عربي"` to any element. The JS in `main.js` swaps them automatically on language toggle. For `<input>` / `<textarea>`, the `placeholder` is swapped automatically using `data-placeholder-en` and `data-placeholder-ar`.

#### Add a new menu item
Copy any `<article>` in `pages/menu/index.html` and update:
- `data-category="[espresso|cold-brew|specialty|seasonal|food]"` — for the filter
- `data-name="..."` and `data-name-ar="..."` and `data-price="[number]"` on the `.add-to-cart-btn`
- EGP price displayed as `ج.م [amount]`

#### Change a price
All prices are hardcoded as `ج.م [amount]`. Search for `ج.م` in the file you want to edit and update the number.

---

### Tech Stack

| Technology | Role |
|---|---|
| Tailwind CSS (CDN) | Utility styling, class-based dark mode |
| Vanilla JavaScript (ES5 IIFE) | All interactivity, no framework |
| FormSubmit (Service) | Order, contact & reservation emails |
| AOS (`aos@2.3.4`) | Scroll entrance animations |
| Material Symbols Outlined | Icons (Google Fonts CDN) |
| Cormorant Garamond / Outfit / DM Mono / Tajawal | Typography (Google Fonts) |

---

