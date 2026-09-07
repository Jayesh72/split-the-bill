# Split the Bill

**Split the Bill** is a modern, privacy-first web application designed to simplify splitting restaurant and dining expenses. It eliminates tedious manual math by letting users upload or photograph restaurant receipts, extract itemized dishes, taxes, and service charges via AI OCR, assign items to diners (including custom shared items), and share instant settlement breakdowns with direct UPI and payment links.

---

## Features

### Currently Implemented

* **Landing Page**:
  * Complete, high-fidelity responsive landing page matching approved UI specifications.
  * Tactile, soft-neumorphic design language with a curated teal accent palette (`#0D766E`) on neutral slate background (`#EEF2F6`).
  * Hero section with value proposition, tagline, and central **Get Started →** CTA.
  * Interactive receipt preview showing an itemized calculation and 4-diner settlement breakdown for "The Olive Table".
  * 4-step workflow overview ("Land. Use. Split. Share.").
  * 2×2 feature grid ("Why Split The Bill feels different.").
  * Bottom conversion card and privacy/settlement footer.
  * Client-side routing connecting all starting CTAs directly to `/split`.

* **Upload & Capture Page (`/split`)**:
  * 5-step horizontal progress stepper showing **Step 1: Upload Bill (ACTIVE STEP)**.
  * Drag-and-drop receipt upload dropzone supporting drag-over visual feedback, native file picker, and keyboard paste (`Ctrl+V`).
  * **File Validation**: Restricts uploads strictly to allowed extensions (`.png`, `.jpeg`, `.jpg`, `.webp`, `.heic`, `.pdf`, `.bmp`, `.tiff`).
  * **Batch Limit**: Upload up to a maximum of **5 images** at a time with file queue display, individual file removal, and batch clearing.
  * **Rate Limiter**: Client-side rate limiting (max 5 upload actions per minute with 2-second cooldown and real-time countdown timer).
  * Quick action triggers: *Open Camera*, *Paste Screenshot (Ctrl+V)*, and *Sample: The Olive Table*.
  * Client-side privacy guarantee banner.
  * Demonstration Live OCR Scanner card showing simulated scanning laser, cyan bounding boxes, status progression, and itemized preview.
  * 3 product feature summary cards (Proportional Tax, Shared Appetizers, QR Payment).

* **AI OCR Service Integration**:
  * Integration utility (`src/lib/gemini.ts`) using `@google/generative-ai` with Google Gemini 1.5 Flash.
  * Structured JSON schema extraction for restaurant metadata, itemized dishes, quantities, individual prices, GST/VAT rates, service charge, and grand total.
  * Configurable via `.env` (`VITE_GEMINI_API_KEY`).

### Mocked / Demonstration Only (At Current Stage)

* The live OCR scanning display on `/split` is currently a visual mock representation until connected to the full end-to-end processing pipeline in the next phase.
* Steps 2 through 5 of the progress stepper (Review OCR, Add People, Assign Items, Share Split) are visual previews representing upcoming application stages.

---

## Application Flow

```text
Landing Page (/)
      ↓
Upload & Capture (/split)   ✅ Implemented
      ↓
Review OCR                  ⏳ Planned
      ↓
Add People                  ⏳ Planned
      ↓
Assign Items                ⏳ Planned
      ↓
Share Split                 ⏳ Planned
```

---

## Routes

| Route | Page / Component | Description | Status |
|---|---|---|---|
| `/` | `LandingPage` (`src/pages/LandingPage.tsx`) | Product landing page with hero, bill preview, workflow, and CTA | ✅ Implemented |
| `/split` | `SplitBillPage` (`src/pages/SplitBillPage.tsx`) | Receipt upload, drag-and-drop dropzone, file validation, rate limiting, and OCR preview | ✅ Implemented |
| `/review` | Review OCR | Itemized receipt verification and manual correction | ⏳ Planned |
| `/people` | Add People | Group diner entry and avatar selection | ⏳ Planned |
| `/assign` | Assign Items | Interactive dish-to-diner item assignment | ⏳ Planned |
| `/share` | Share Split | Individual itemized shares, UPI deep links, and WhatsApp sharing | ⏳ Planned |

---

## Tech Stack

* **Framework**: [React 18.3.1](https://react.dev/)
* **Language**: [TypeScript 5.7.3](https://www.typescriptlang.org/)
* **Build Tool**: [Vite 6.2.0](https://vitejs.dev/)
* **Routing**: [React Router DOM 7.18.3](https://reactrouter.com/)
* **Styling**: [Tailwind CSS 3.4.17](https://tailwindcss.com/) with PostCSS & Autoprefixer
* **Icons**: [Lucide React 0.475.0](https://lucide.dev/)
* **AI / OCR SDK**: [@google/generative-ai 0.24.1](https://www.npmjs.com/package/@google/generative-ai) (Google Gemini API)
* **Code Quality**: [ESLint 9.21.0](https://eslint.org/) & [Prettier 3.5.2](https://prettier.io/)

---

## Dependencies

Dependency management for this project is handled exclusively by **Node.js / npm** via `package.json` and `package-lock.json`.

| Dependency | Version | Purpose |
|---|---|---|
| `react` | `^18.3.1` | Core UI library |
| `react-dom` | `^18.3.1` | React DOM renderer |
| `react-router-dom` | `^7.18.3` | Client-side routing between Landing (`/`) and Upload (`/split`) |
| `@google/generative-ai` | `^0.24.1` | Google Gemini API SDK for multimodal receipt extraction |
| `lucide-react` | `^0.475.0` | Modern UI icon library |
| `clsx` | `^2.1.1` | Utility for conditional CSS class composition |
| `tailwind-merge` | `^2.6.0` | Utility for merging Tailwind CSS classes without specificity conflicts |

---

## Project Structure

```text
split-bill/
├── .env                       # Local environment variables (VITE_GEMINI_API_KEY)
├── .env.example               # Template for environment variables
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier code formatting rules
├── eslint.config.js           # ESLint 9 configuration
├── index.html                 # HTML entry with Plus Jakarta Sans Google font
├── package.json               # Canonical npm dependencies and scripts
├── package-lock.json          # Locked dependency tree
├── postcss.config.js          # PostCSS configuration
├── requirements.txt           # Notice clarifying JS/npm dependency management
├── tailwind.config.js         # Tailwind design tokens, colors, shadows, and fonts
├── tsconfig.json              # TypeScript configuration with path aliases (@/*)
├── tsconfig.node.json         # TypeScript configuration for Vite tooling
├── vite.config.ts             # Vite configuration with path aliases
├── docs/
│   └── UI-SPEC.md             # Authoritative UI and design specification
├── public/
│   └── favicon.svg            # Brand favicon SVG
├── reference/                 # Authoritative design screenshots
│   ├── landing-page.png       # Landing page desktop design
│   ├── landing-page-continue.png # Landing page continuation
│   ├── split-bill-upload.png  # Upload & Capture page design
│   └── shared-bill.png        # Shared bill / settlement breakdown design
└── src/
    ├── main.tsx               # React application entrypoint
    ├── App.tsx                # Root router configuration
    ├── index.css              # Custom neumorphic styles and design tokens
    ├── vite-env.d.ts          # Vite client environment TypeScript definitions
    ├── types/
    │   └── index.ts           # ReceiptItem, DinerShare, and BillSummary interfaces
    ├── lib/
    │   ├── gemini.ts          # Google Gemini AI receipt OCR parser service
    │   └── utils.ts           # Utility functions (cn, formatCurrency)
    ├── components/
    │   ├── ui/
    │   │   ├── Badge.tsx      # Diner tags and status badges
    │   │   ├── Button.tsx     # Tactile neumorphic button variants
    │   │   ├── Card.tsx       # Soft card container primitives
    │   │   └── LogoIcon.tsx   # Custom Split The Bill brand SVG icon
    │   ├── landing/
    │   │   ├── Navbar.tsx     # Navigation header with client-side links
    │   │   ├── Hero.tsx       # Hero headline and centered Get Started CTA
    │   │   ├── ReceiptPreviewCard.tsx # "The Olive Table" calculation & settlement demo
    │   │   ├── WorkflowSection.tsx    # 4-step workflow overview cards
    │   │   ├── FeaturesSection.tsx    # 2x2 fairness feature grid
    │   │   ├── CtaSection.tsx         # Bottom conversion card
    │   │   └── Footer.tsx             # Privacy & settlement footer
    │   └── split/
    │       ├── BillProgressStepper.tsx # 5-step progress stepper
    │       ├── SplitHeader.tsx         # Page title with ZERO SIGN-UP REQUIRED badge
    │       ├── UploadDropzone.tsx      # Multi-file dropzone with validation & rate limiter
    │       ├── PrivacyNotice.tsx       # In-memory privacy guarantee note
    │       ├── OCRScannerCard.tsx      # Live OCR scanner preview & status progression
    │       └── SplitFeatureCards.tsx   # 3 bottom feature cards
    └── pages/
        ├── LandingPage.tsx    # Landing page layout (Route: /)
        └── SplitBillPage.tsx  # Upload & Capture page layout (Route: /split)
```

---

## Landing Page

The landing page (`/`) faithfully recreates the approved design from `reference/landing-page.png` and `reference/landing-page-continue.png`:

* **Navbar**: Split The Bill logo, tagline `SCAN IT. SPLIT IT. DONE.`, navigation links (**Home**, **Split a Bill**), and primary **Start Splitting →** button.
* **Hero**: Headline `Split the bill without the awkward math.` (with teal accent), subtext, and centered **Get Started →** button.
* **Receipt Preview Card**: Displays an authentic sample bill for "The Olive Table" (Indiranagar, Bengaluru) with 6 detected items, subtotal (`₹1,600.00`), GST 18% (`₹288.00`), Service Charge 10% (`₹160.00`), Grand Total (`₹2,048.00`), and a 4-diner settlement breakdown (`Jayesh`, `Rahul`, `Ankit`, `Priya`) with an interactive copyable WhatsApp & UPI settlement link.
* **Workflow & Features**: Step-by-step process cards and 2×2 fairness advantages.
* **CTA Routing**: All starting actions navigate client-side to `/split`.

---

## Upload & Capture (`/split`)

The Upload & Capture page (`/split`) establishes the initial receipt intake step:

* **Progress Stepper**: Displays Step 1 (`Upload Bill ACTIVE STEP`) as highlighted, indicating upcoming phases.
* **Header**: Title `Let's split your bill.` with `ZERO SIGN-UP REQUIRED` badge.
* **Multi-File Upload Dropzone**:
  * Supports drag-and-drop, native file browser, and `Ctrl+V` screenshot pasting.
  * **File Extensions**: Strictly permits `.png`, `.jpeg`, `.jpg`, `.webp`, `.heic`, `.pdf`, `.bmp`, and `.tiff`.
  * **File Limits**: Enforces a maximum of **5 files per batch**.
  * **Rate Limiter**: Built-in sliding-window limiter enforcing a maximum of 5 uploads per minute and a 2-second cooldown between rapid actions.
  * **Queue Management**: Shows selected files with sizes and remove buttons.
  * **Quick Actions**: *Open Camera*, *Paste Screenshot (Ctrl+V)*, and *Sample: The Olive Table*.
* **Privacy Notice**: Reassuring notice confirming in-memory client-side processing.
* **Live OCR Scanner Preview**: Stylized scanner card with glowing scan beam animation, cyan bounding boxes, status progression list, itemized preview, and `Continue to Review Bill →` action.
* **Bottom Feature Cards**: Highlights Proportional Tax, Shared Appetizers, and QR Payment settlement.

---

## OCR / Receipt Processing

* **Location**: `src/lib/gemini.ts`
* **Provider**: Google Gemini API via `@google/generative-ai` (`gemini-1.5-flash`).
* **Environment Variable**: `VITE_GEMINI_API_KEY` (configured in `.env`).
* **Extraction Schema**:
  ```typescript
  export interface ExtractedReceiptData {
    restaurantName: string;
    location?: string;
    billNumber?: string;
    items: {
      name: string;
      qty: number;
      price: number;
      isShared?: boolean;
    }[];
    subtotal: number;
    gst?: number;
    gstRate?: number;
    serviceCharge?: number;
    serviceChargeRate?: number;
    grandTotal: number;
  }
  ```
* **Status**: The backend helper service is configured and typed. The UI on `/split` currently displays a mock demonstration preview until connected to the full interactive flow.

---

## Data Models

Defined in `src/types/index.ts` and `src/lib/gemini.ts`:

* **`ReceiptItem`**: Individual receipt item with ID, name, quantity description, price, shared flag, and diner assignment.
* **`DinerShare`**: Individual diner's split share including name, avatar initial, breakdown summary, total owed amount, and payment status.
* **`BillSummary`**: Overall bill metadata including restaurant name, verification status, location, bill number, companion count, subtotal, GST, service charge, and grand total.
* **`ExtractedReceiptData`**: Raw extracted schema from Gemini OCR processing.

---

## Sample Data

* **Restaurant**: The Olive Table (Indiranagar, Bengaluru • Bill #IND-89241)
* **Items**:
  1. Butter Chicken — ₹420 (Jayesh)
  2. Paneer Tikka — ₹360 (Rahul)
  3. Garlic Naan ×2 (Shared) — ₹180 (Jayesh + Priya)
  4. Dal Makhani — ₹320 (Ankit)
  5. Coke ×2 (Shared) — ₹80 (Rahul + Ankit)
  6. Gulab Jamun — ₹240 (Priya)
* **Totals**: Subtotal ₹1,600.00 + GST 18% (₹288.00) + Service Charge 10% (₹160.00) = **₹2,048.00**
* **Settlement**: Jayesh (₹668.00), Rahul (₹490.00), Ankit (₹445.00), Priya (₹445.00).

---

## Design System

* **Visual Style**: Soft neumorphism with light neutral surfaces and tactile controls.
* **Colors**:
  * Background: `#EEF2F6` (soft slate)
  * Card Surfaces: `#FFFFFF` / `#F8FAFC`
  * Primary Brand Accent: Deep Teal `#0D766E` (hover: `#0B615A`, light tint: `#E6F4EA`)
  * Typography / Charcoal: `#0F172A` (heading), `#1E293B` (body), `#64748B` (muted), `#94A3B8` (light)
  * Status / Highlights: `#10B981` (emerald green), `#2DD4BF` (cyan scan glow), `#F59E0B` (amber)
* **Typography**: Geometric sans-serif [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) imported via Google Fonts.
* **Borders & Shadows**: `rounded-2xl`, `rounded-3xl`, soft diffused box shadows (`0 8px 24px -4px rgba(15,23,42,0.06)`), and subtle inset shadows.

---

## Local Development

### Prerequisites

* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/Jayesh72/split-the-bill.git
   cd split-bill
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   * Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   * Add your Google Gemini API key to `.env`:
     ```env
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     ```

### Development Server

Start the local Vite development server:

```bash
npm run dev
```

The application will be available at:
* Landing Page: `http://localhost:5173/`
* Upload & Capture: `http://localhost:5173/split`

### Production Build

Type-check with `tsc` and create a production build with Vite:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint across the codebase:

```bash
npm run lint
```
