# Split the Bill

**Split the Bill** is a modern, privacy-first web application designed to simplify restaurant and dining expense splitting. It eliminates tedious manual math and awkward bill calculations by letting users upload or photograph restaurant receipts, extract itemized dishes, taxes, and service charges via a high-performance **Python FastAPI** backend powered by **Google Gemini Multimodal Vision API**, add custom dining companions, assign individual and shared dishes to diners, and generate instant, mathematically balanced settlement breakdowns with dynamic UPI payment QR codes, WhatsApp share requests, and print-friendly receipt summaries.

---

## Architecture Overview

The system follows a clean, decoupled client-server architecture:

```text
React Frontend (Vite • TypeScript • Tailwind CSS)
      │
      │  1. Multipart Upload (POST /api/ocr/extract)
      ▼
Python FastAPI Backend (Uvicorn • Python 3.11+)
      │
      │  2. CORS Allowlist & In-Memory Rate Limiting
      │  3. Multimodal Analysis (Google Gemini Vision • gemini-2.5-flash)
      ▼
Google Gemini API (Encrypted Server-Side Request)
      │
      │  4. Structured Receipt Extraction (JSON Schema Mode)
      ▼
Pydantic Data Contract Validation (ExtractedReceiptData)
      │
      │  5. Validated JSON Response Envelope
      ▼
React Frontend State (BillContext • Arithmetic Settlement Engine)
```

> **Security Guarantee**: The `GEMINI_API_KEY` is stored **exclusively** on the Python backend environment (`backend/.env`) and is never exposed to the frontend, browser, or Git repository. The frontend communicates with the backend via standard REST endpoints (`/api/ocr/extract`, `/api/health`).

---

## Features

The application provides a complete, high-fidelity 5-step end-to-end workflow:

```text
Landing Page (/)
      ↓
1. Upload & Capture (/split)
      ↓
2. Review OCR (/review)
      ↓
3. Add Dining Companions (/add-people)
      ↓
4. Assign Items to Diners (/assign)
      ↓
5. Share Split & Settle (/share)
```

---

### 1. Upload & Capture Bill (`/split`)
* **Multi-Input Upload Dropzone**:
  * Drag-and-drop file upload with visual hover feedback.
  * Native OS file browser selector.
  * Direct clipboard paste (`Ctrl+V`) for instant screenshot processing.
* **File Validation**:
  * Strict file type enforcement (`.png`, `.jpeg`, `.jpg`, `.webp`, `.heic`, `.pdf`, `.bmp`, `.tiff`).
  * Enforces a maximum file size of **5MB per file** (with backend supporting up to 10MB).
* **Batch Upload Queue**:
  * Upload up to **5 images simultaneously** with individual file preview, individual removal, and batch clearing.
* **Client-Side Rate Limiter**:
  * Sliding-window rate limiter (maximum 5 upload actions per minute with a 2-second cooldown and real-time countdown timer).
* **Live AI OCR Scanner**:
  * Visual laser scanning animation on the uploaded receipt image.
  * Multi-stage live extraction status indicators: *Image Uploaded* $\rightarrow$ *Analyzing with FastAPI & Gemini Vision* $\rightarrow$ *Extracting dishes & prices* $\rightarrow$ *Calculating taxes* $\rightarrow$ *Completed*.
  * Communicates asynchronously with the FastAPI backend endpoint (`POST /api/ocr/extract`).
* **Demo Bill Preset**:
  * One-click "Try with Pre-filled Demo Bill" ("The Olive Table") for testing the entire flow without an API key or receipt image.
* **Privacy Assurance**:
  * Client-side in-memory processing guarantee banner (no receipt data or images permanently stored on external servers).

---

### 2. Review OCR (`/review`)
* **Restaurant & Receipt Metadata Card**:
  * Displays extracted restaurant name, address, receipt date/time, and bill number.
* **Interactive Line Items Table**:
  * Dynamically renders every extracted dish and drink from backend Pydantic validation.
  * Inline editable item names.
  * Interactive quantity controls (increment/decrement with minimum quantity of 1).
  * Inline editable unit prices with automatic line total recalculation ($\text{Quantity} \times \text{Unit Price}$).
* **Dish Management**:
  * Add custom dish items manually with custom names, quantities, and prices.
  * Delete dishes with automatic subtotal recalculation.
* **Configurable Taxes & Service Charges**:
  * Adjustable GST/Tax rate (e.g., 5%, 18%) with real-time tax calculation.
  * Adjustable Service Charge rate (e.g., 0%, 10%) with real-time fee calculation.
* **Live Totals & Reconciliation**:
  * Real-time calculation of Subtotal, Tax, Service Charge, and Grand Total.
  * Arithmetic discrepancy detection comparing calculated items against the receipt total.
  * Visual balance badge: `✓ Totals match (₹0.00 diff)`.
* **Step Progression**:
  * `Continue to Add People →` button seamlessly carries the reviewed bill state to Step 3.

---

### 3. Add Dining Companions (`/add-people`)
* **Dynamic Group Creation**:
  * Zero hardcoded or static names—users create the group dynamically.
  * Quick text input with instant validation and duplicate prevention.
* **Avatar Color Palette**:
  * 8 curated companion avatar colors: Teal (`#0D766E`), Blue (`#2563EB`), Purple (`#7C3AED`), Pink (`#DB2777`), Orange (`#EA580C`), Emerald (`#059669`), Amber (`#D97706`), and Indigo (`#4F46E5`).
  * Automatic cyclic color assignment for new members with custom color picker selection.
* **Organizer & Payer Designation**:
  * First added person is automatically designated as default Organizer and initial Payer.
  * **Dedicated Payer Selector Card**: Explicitly select which companion settled the restaurant receipt.
  * Clearly separates the three distinct roles: **Organizer** (manages the split), **Payer** (settled the receipt), and **Assignee** (diner claiming dishes).
* **Companion Management**:
  * Inline companion name and avatar color editing using stable UUIDs.
  * Remove companion with automatic fallback reassignment for organizer and payer.
  * Automatic assignment reference cleanup: deleting a member removes them from assigned dishes without breaking other diners' shares.
* **Context & Summary Cards**:
  * Live Bill Context Card displaying restaurant name, items count, and total.
  * Group Summary Card showing total diners joined and assigned roles.
* **Step Progression**:
  * `Continue to Assign Items →` button enabled as soon as at least 1 companion is added.

---

### 4. Assign Items to Diners (`/assign`)
* **Dynamic Dish Assignment**:
  * Consumes actual items from `bill.items` and companions from `people`.
  * Renders interactive dish cards with status badges: `Unassigned`, `Solo Dish`, or `Shared by N Diners`.
* **Single & Shared Item Support**:
  * **Solo Assignment**: Assign a dish directly to one person.
  * **Shared Item Multi-Select**: Split a dish across any combination of diners using interactive checkboxes.
  * Equal division formula: $\text{Diner Share} = \frac{\text{Item Total Price}}{\text{Number of Assigned Diners}}$.
  * Prevents double-counting: shared dish coverage is accounted for once at the bill level while member shares divide the exact cost.
* **Quick Actions**:
  * "Select All" button to split appetizers, drinks, or shared sides across the entire table in one click.
  * "Clear" button to unassign a dish.
* **Live Progress & Filter Tabs**:
  * Real-time assignment tracker: `X of Y dishes assigned (Z% complete)`.
  * Filter tabs to quickly view: **All Dishes**, **Unassigned Only**, or **Assigned Only**.
* **Live Diners Breakdown & Balance Check**:
  * Per-companion summary showing claimed dish count, subtotal, and tax-adjusted total.
  * Bill reconciliation card displaying Bill Total, Assigned Amount, and Unassigned Balance.
* **Strict Continuation Gate**:
  * `Continue to Share Split →` button is strictly disabled until **100% of bill items are assigned** to at least one dining companion.

---

### 5. Share Split & Settle (`/share`)
* **Settlement Header & Verification**:
  * Displays restaurant metadata, receipt number, date/time, and grand total.
  * Distinct badges identifying the **Payer** ("Bill Paid by: [Name]") and **Organizer**.
  * Visual balance verification badge: `✓ Reconciled — Split total matches bill`.
* **Settlement Tracker & Paid Status**:
  * Tracks Total Bill, Marked Paid amount, Pending amount, and settled member count.
  * Progress bar showing percentage of group collected.
  * Individual "Mark Paid" / "Paid" toggle button per diner.
  * "Mark All as Paid" and "Reset to Pending" batch actions.
  * Celebration banner when all members are settled ("All settled! Everyone is marked as paid 🎉").
  * Non-custodial transparency disclaimer explaining local tracking without fake payment confirmations.
* **Individual Member Split Cards**:
  * Diner avatar, name, role badges (Organizer / Payer / Member), and total amount owed.
  * Expandable dish-by-dish accordion breakdown: lists every claimed dish, solo vs shared tag, co-diner names, and exact share price.
  * Proportional GST/Tax and Service Charge breakdown rows.
  * Reconciled total calculation ensuring $\sum (\text{member totals}) \equiv \text{bill.grandTotal}$ down to the exact paise.
* **Instant UPI Payments & QR Code Modal**:
  * Split the Bill can generate UPI payment intents and QR codes using the payer's UPI ID and each diner's calculated amount. Payments are completed in the user's UPI application; the application does not directly process or verify payments.
  * Validates standard UPI VPA syntax (`username@provider`) without asserting bank ownership.
  * If no UPI ID is entered, the modal prompts the organizer to enter their real UPI ID without leaving the settlement flow.
  * Generates standard NPCI UPI payment intent URIs: `upi://pay?pa=<payerUpiId>&pn=<payerName>&am=<amount>&cu=INR&tn=Split bill for <restaurant>`.
  * Dynamic QR code generated in real-time using `qrcode` for each member's exact calculated settlement amount.
  * Generic "Pay Now" UPI deep link on mobile devices and one-click copy actions for the UPI link and UPI ID.
  * Clear payment verification disclaimer distinguishing QR generation from payment completion; "Mark as Paid" is strictly local/manual.
* **WhatsApp Sharing**:
  * **Individual Share**: Generates personalized payment requests (*"Hey Rahul! Your share for The Olive Table is ₹490.00. You had: Paneer Tikka and Coke. Please settle up with Priya via UPI."*).
  * **Group Bill Share**: Generates a full markdown/plain-text breakdown of the entire table's split.
* **Print-Friendly Receipt Summary**:
  * 1-Click "Print Receipt" triggers the browser print dialog with an authentic monospace restaurant split receipt (`@media print`) formatted for physical receipts or save-as-PDF via browser.
* **Navigation & Guard Safety**:
  * `← Back to Assign Items` preserves all assignments and state.
  * "Start New Bill Split" resets state with a confirmation modal.
  * Safety guards prevent broken states if `/share` is opened directly without a bill, without companions, or with unassigned dishes.

---

## State Persistence & Lifecycle

* **Session Scope**: Bill splitting state is maintained in React Context during the active session.
* **Route Navigation**: Navigating between steps (`/split` $\leftrightarrow$ `/review` $\leftrightarrow$ `/add-people` $\leftrightarrow$ `/assign` $\leftrightarrow$ `/share`) preserves all bill items, dining companions, assignments, and calculated shares.
* **Browser Refresh**: A full browser refresh resets in-memory state because persistent storage/database has intentionally not been implemented for this lightweight, privacy-first tool.
* **Safety Guards**: Directly opening later steps without required prior state renders friendly guard cards with direct navigation buttons back to the prerequisite step.

---

## Technical Security & Hardening Architecture

1. **Server-Side AI Secrets**: The `GEMINI_API_KEY` is exclusively managed on the Python backend (`backend/.env`). No AI SDK or secrets are loaded into the browser bundle.
2. **Binary Image Inspection**: Uploaded receipt files are inspected using Pillow (`PIL.Image.verify()`) to reject corrupted files, renamed executables, and spoofed MIME types.
3. **Prompt Injection Defense-in-Depth**: Strict instruction hierarchy instructs the AI model to treat all image text strictly as untrusted raw data and ignore embedded instructions or commands.
4. **In-Memory Rate Limiting**: Sliding-window rate limiter prevents abuse (designed for single backend instances / local development).
5. **Stable RFC4122 UUIDs**: All dining companion and dish identifiers are generated via standard UUID v4 (`crypto.randomUUID()`).
6. **Non-Custodial UPI Handling**: Real user-entered UPI IDs only (never derived from names or faked); payment intents and dynamic QR codes are generated client-side for standard UPI applications.

---

## Tech Stack

### Frontend
* **Framework**: [React 18.3.1](https://react.dev/)
* **Language**: [TypeScript 5.7.3](https://www.typescriptlang.org/)
* **Build Tool**: [Vite 6.2.0](https://vitejs.dev/)
* **Styling**: [Tailwind CSS 3.4.17](https://tailwindcss.com/)
* **Routing**: [React Router 7.18.3](https://reactrouter.com/)
* **Icons**: [Lucide React 0.475.0](https://lucide.dev/)
* **QR Generation**: [QRCode 1.5.4](https://www.npmjs.com/package/qrcode)

### Backend
* **Framework**: [FastAPI 0.115+](https://fastapi.tiangolo.com/)
* **ASGI Server**: [Uvicorn 0.34+](https://www.uvicorn.org/)
* **Language**: Python 3.11+
* **Data Validation**: [Pydantic v2](https://docs.pydantic.dev/)
* **Image Processing**: [Pillow 10.0+](https://python-pillow.org/)
* **AI Engine**: [Google GenAI Python SDK](https://github.com/googleapis/python-genai) (`google-genai`) & OpenAI Python SDK
* **Testing**: [Pytest 8.3+](https://docs.pytest.org/) & [HTTPX](https://www.python-httpx.org/)

---

## Project Structure

```text
split-bill/
├── backend/                        # Python FastAPI Backend
│   ├── app/
│   │   ├── __init__.py             # Application package metadata
│   │   ├── main.py                 # FastAPI application, CORS, exception handlers
│   │   ├── config.py               # Centralized Pydantic settings & env management
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── ocr.py              # Pydantic models (ExtractedReceiptData, OCRResponse)
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── gemini_service.py   # Google GenAI SDK Vision OCR extraction service
│   │   │   └── openai_service.py   # Async OpenAI Vision OCR service (Alternative)
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── health.py           # GET /api/health
│   │   │   └── ocr.py              # POST /api/ocr/extract
│   │   └── middleware/
│   │       ├── __init__.py
│   │       └── rate_limiter.py     # Sliding-window IP rate limiter
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_health.py          # Health check endpoint tests
│   │   ├── test_schemas.py         # Pydantic schema validation tests
│   │   ├── test_ocr_route.py       # OCR extraction route integration tests
│   │   ├── test_upload_validation.py # Binary image inspection & spoofing tests
│   │   ├── test_rate_limiter.py    # Rate limiter middleware tests
│   │   ├── test_business_logic.py  # Settlement math & exact reconciliation tests
│   │   └── test_upi.py             # UPI URI generator & format validation tests
│   ├── requirements.txt            # Python dependencies (FastAPI, Uvicorn, google-genai, Pillow)
│   ├── .env.example                # Backend environment variables template (GEMINI_API_KEY)
│   ├── .gitignore                  # Python-specific git ignore rules
│   └── README.md                   # Backend architecture and setup documentation
├── .env.example                    # Frontend environment variables template (VITE_API_BASE_URL)
├── .gitignore                      # Root git ignore rules (includes backend/.env)
├── package.json                    # Frontend dependencies and npm scripts
├── package-lock.json               # Locked frontend dependency tree
├── requirements.txt                # Root notice pointing to backend/requirements.txt
├── tailwind.config.js              # Tailwind design tokens, teal palette, animations
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
├── docs/
│   └── UI-SPEC.md                  # Authoritative UI specification
└── src/
    ├── main.tsx                    # React application entrypoint
    ├── App.tsx                     # React Router routes (/ , /split, /review, /add-people, /assign, /share)
    ├── index.css                   # Global Tailwind utilities and soft neumorphic styles
    ├── types/
    │   └── index.ts                # TypeScript interfaces (Bill, BillItem, DiningCompanion, PersonShareSummary)
    ├── context/
    │   └── BillContext.tsx         # Unified state provider & arithmetic calculation engine
    ├── lib/
    │   ├── api.ts                  # Backend REST API client (extractReceiptFromBackend, checkBackendHealth)
    │   ├── upi.ts                  # UPI format validation & URI intent generator
    │   └── utils.ts                # Formatting utilities (cn, formatCurrency, getInitials, generateUUID)
    ├── components/
    │   ├── ui/                     # Reusable design system primitives (Badge, Button, Card, LogoIcon)
    │   ├── landing/                # Landing page sections (Hero, WorkflowSection, FeaturesSection, CtaSection, Footer)
    │   ├── split/                  # Step 1 Upload components (Dropzone, OCRScannerCard, Stepper)
    │   ├── review/                 # Step 2 Review components (ReceiptInfoCard, ExtractedItemsTable, BillSummary)
    │   ├── people/                 # Step 3 People components (AddPersonForm, PersonCard, PayerSelectorCard)
    │   ├── assign/                 # Step 4 Assign components (ItemAssignmentCard, AssignmentProgressCard, PersonSharesCard)
    │   └── share/                  # Step 5 Share components (SettlementHeader, MemberSplitCard, UpiModal, PrintReceipt)
    └── pages/
        ├── LandingPage.tsx          # Route: /
        ├── SplitBillPage.tsx        # Route: /split (Step 1)
        ├── ReviewOCRPage.tsx        # Route: /review (Step 2)
        ├── AddPeoplePage.tsx        # Route: /add-people (Step 3)
        ├── AssignItemsPage.tsx      # Route: /assign (Step 4)
        └── ShareSplitPage.tsx       # Route: /share (Step 5)
```

---

## Local Development & Setup

### 1. Backend Setup (FastAPI)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create Python virtual environment
python -m venv .venv

# 3. Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\activate
# macOS / Linux:
# source .venv/bin/activate

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Configure environment variables
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY

# 6. Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

The backend will be running at [http://localhost:8000](http://localhost:8000).

### 2. Frontend Setup (React + Vite)

In a separate terminal:

```bash
# 1. Install Node.js dependencies
npm install

# 2. Start Vite development server
npm run dev
```

The frontend will be running at [http://localhost:5173](http://localhost:5173).

---

## Testing & Quality Assurance

### Run Backend Tests (Pytest)
```bash
cd backend
.venv\Scripts\pytest tests
```

### Run Frontend Typecheck & Build
```bash
npm run build
```

### Run Frontend Linter
```bash
npm run lint
```
