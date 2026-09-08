# Split the Bill

**Split the Bill** is a modern, privacy-first web application designed to simplify restaurant and dining expense splitting. It eliminates tedious manual math and awkward bill calculations by letting users upload or photograph restaurant receipts, extract itemized dishes, taxes, and service charges via AI OCR, add custom dining companions, assign individual and shared dishes to diners, and generate instant, mathematically balanced settlement breakdowns with dynamic UPI payment QR codes, WhatsApp share requests, and printable PDF receipts.

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
  * Enforces a maximum file size of **5MB per file**.
* **Batch Upload Queue**:
  * Upload up to **5 images simultaneously** with individual file preview, individual removal, and batch clearing.
* **Client-Side Rate Limiter**:
  * Sliding-window rate limiter (maximum 5 upload actions per minute with a 2-second cooldown and real-time countdown timer).
* **Live AI OCR Scanner**:
  * Visual laser scanning animation on the uploaded receipt image.
  * Multi-stage live extraction status indicators: *Image Uploaded* $\rightarrow$ *Analyzing with Gemini* $\rightarrow$ *Extracting dishes & prices* $\rightarrow$ *Calculating taxes* $\rightarrow$ *Completed*.
  * Extracts restaurant name, location, receipt date/number, line items, quantities, prices, taxes, and grand totals using Google Gemini API.
* **Demo Bill Preset**:
  * One-click "Try with Pre-filled Demo Bill" ("The Olive Table") for testing without an API key or receipt image.
* **Privacy Assurance**:
  * Client-side in-memory processing guarantee banner (no receipt data or images stored on external servers).

---

### 2. Review OCR (`/review`)
* **Restaurant & Receipt Metadata Card**:
  * Displays extracted restaurant name, address, receipt date/time, and bill number.
* **Interactive Line Items Table**:
  * Dynamically renders every extracted dish and drink.
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
  * Generates standard UPI payment intent URIs: `upi://pay?pa=<payerUpiId>&pn=<payerName>&am=<amount>&cu=INR&tn=Split bill for <restaurant>`.
  * Custom dynamic QR code generated in real time using `qrcode` for each member's exact calculated amount.
  * One-click "Open UPI App" button for mobile devices (Google Pay, PhonePe, Paytm, etc.).
  * One-click copy buttons for UPI ID and payment URI with visual feedback.
* **WhatsApp Sharing**:
  * **Individual Share**: Generates personalized payment requests (*"Hey Rahul! Your share for The Olive Table is ₹490.00. You had: Paneer Tikka and Coke. Please settle up with Priya via UPI."*).
  * **Group Bill Share**: Generates a full markdown/plain-text breakdown of the entire table's split.
* **Export & Print PDF**:
  * 1-Click "Download PDF / Print" generates an authentic monospace restaurant split receipt (`@media print`) optimized for browser printing and PDF export.
* **Navigation & Guard Safety**:
  * `← Back to Assign Items` preserves all assignments and state.
  * "Start New Bill Split" resets state with a confirmation modal.
  * Safety guards prevent broken states if `/share` is opened directly without a bill, without companions, or with unassigned dishes.

---

## Application Flow & Dynamic Progress Stepper

The horizontal `BillProgressStepper` component dynamically derives its active state from the current route across all pages:

| Step # | Step Name | Route | Active Stepper State | Description |
|---|---|---|---|---|
| **Step 1** | **Upload Bill** | `/split` | Step 1 Active (Steps 2–5 Upcoming) | Upload receipt, drag-and-drop, rate limit, Gemini OCR |
| **Step 2** | **Review OCR** | `/review` | Step 2 Active (Step 1 Done, 3–5 Upcoming) | Edit line items, quantities, prices, taxes & service charges |
| **Step 3** | **Add People** | `/add-people` | Step 3 Active (Steps 1–2 Done, 4–5 Upcoming) | Create dining group, select avatar colors, designate payer |
| **Step 4** | **Assign Items** | `/assign` | Step 4 Active (Steps 1–3 Done, Step 5 Upcoming) | Assign solo/shared dishes, live member subtotals & gating |
| **Step 5** | **Share Split** | `/share` | Step 5 Active (Steps 1–4 Completed) | Final settlement, UPI QR, WhatsApp share & PDF receipt |

---

## Dynamic State Management

All application state is centrally managed using React Context via `BillContext` (`src/context/BillContext.tsx`) and consumed via the `useBill()` hook:

```text
BillProvider (Shared State)
 ├── bill: Bill                              # Restaurant metadata, line items, taxes, totals
 ├── people: DiningCompanion[]               # Diners with stable IDs, names, avatar colors, isOrganizer
 ├── payerId: string | null                  # ID of the companion who paid the restaurant bill
 ├── assignments: Record<string, string[]>   # Mapping of itemId -> personId[]
 ├── paidStatus: Record<string, boolean>     # Mapping of personId -> isPaid (local settlement tracking)
 ├── personShares: PersonShareSummary[]      # Derived per-diner calculations with rounding reconciliation
 └── helper methods:
      ├── setBillFromOCR()                   # Populates bill from Gemini OCR payload
      ├── updateItem() / addItem() / deleteItem()
      ├── addPerson() / updatePerson() / removePerson() / setOrganizer() / setPayerId()
      ├── assignItem() / togglePersonOnItem() / clearItemAssignment()
      ├── togglePaidStatus() / markAllPaid()
      └── resetAll()                         # Clears state for a new split
```

### State Consistency & ID Stability
* All assignments and payer designations reference stable, immutable IDs (`person.id`, `item.id`).
* Renaming a companion in Step 3 automatically updates their name across Step 4 and Step 5 without losing their item assignments.
* Deleting a companion in Step 3 automatically removes their references from assigned dishes and cleans up payer designations.
* Navigating backwards and forwards preserves all inputs and assignments.

---

## AI OCR / Receipt Extraction Architecture

Receipt parsing is implemented in `src/lib/gemini.ts` using the Google Generative AI SDK (`@google/generative-ai`):

* **Multimodal Extraction**: Converts the uploaded image file to a base64 payload and sends it with a structured system prompt to Google Gemini.
* **Model Fallback Cascade**: Evaluates candidate models sequentially (`gemini-2.5-flash`, `gemini-1.5-flash`, `gemini-flash-latest`, etc.) to guarantee high availability across API tiers.
* **Strict JSON Schema**: Prompt instructs the model to return a clean JSON object containing restaurant name, location, bill number, currency symbol, itemized line items (name, quantity, price), subtotal, GST rate/amount, service charge rate/amount, and grand total.
* **Sanitization & Error Handling**: Sanitizes string inputs, coerces numerical quantities and prices, handles missing subtotal/tax values, and provides user-friendly error messages if API keys are invalid.

---

## Data Models

The core TypeScript interfaces defined in `src/types/index.ts` are:

```typescript
// Extracted & Reviewed Bill Line Item
export interface BillItem {
  id: string | number;
  name: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  confidence?: number;
  isShared?: boolean;
  assignedTo?: string[];
}

// Complete Bill Structure
export interface Bill {
  id: string;
  restaurantName: string;
  address?: string;
  dateTime?: string;
  billNumber?: string;
  currency: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  serviceCharge: number;
  serviceChargeRate: number;
  receiptTotal: number;
  grandTotal: number;
  receiptImagePreviewUrl?: string;
}

// Dining Companion (Group Member)
export interface DiningCompanion {
  id: string;
  name: string;
  avatarColor: string;
  isOrganizer: boolean;
}

// Item Share Assigned to a Diner
export interface AssignedItemShare {
  item: BillItem;
  itemTotal: number;
  assignedCount: number;
  shareAmount: number;
  isShared: boolean;
  coDinerNames: string[];
}

// Computed Individual Diner Breakdown & Settlement Share
export interface PersonShareSummary {
  person: DiningCompanion;
  itemsCount: number;
  subtotal: number;
  taxShare: number;
  serviceChargeShare: number;
  totalShare: number;
  items: AssignedItemShare[];
}
```

---

## Tech Stack

* **Framework**: [React 18.3.1](https://react.dev/)
* **Language**: [TypeScript 5.7.3](https://www.typescriptlang.org/)
* **Build Tool**: [Vite 6.2.0](https://vitejs.dev/)
* **Routing**: [React Router DOM 7.18.3](https://reactrouter.com/)
* **Styling**: [Tailwind CSS 3.4.17](https://tailwindcss.com/) with PostCSS & Autoprefixer
* **Icons**: [Lucide React 0.475.0](https://lucide.dev/)
* **AI / OCR SDK**: [@google/generative-ai 0.24.1](https://www.npmjs.com/package/@google/generative-ai) (Google Gemini API)
* **QR Code Generator**: [qrcode 1.5.4](https://www.npmjs.com/package/qrcode) & `@types/qrcode 1.5.6`
* **Styling Utilities**: `clsx 2.1.1` & `tailwind-merge 2.6.0`
* **Code Quality**: [ESLint 9.21.0](https://eslint.org/) & [Prettier 3.5.2](https://prettier.io/)

---

## Project Structure

```text
split-bill/
├── .env                            # Environment variables (VITE_GEMINI_API_KEY)
├── .env.example                    # Template for environment variables
├── .gitignore                      # Git ignore configuration
├── .prettierrc                     # Prettier formatting rules
├── eslint.config.js                # ESLint 9 flat configuration
├── index.html                      # HTML entry with Plus Jakarta Sans font
├── package.json                    # Canonical dependencies and npm scripts
├── package-lock.json               # Locked dependency tree
├── postcss.config.js               # PostCSS configuration
├── requirements.txt                # Notice regarding Node.js / npm dependency management
├── tailwind.config.js              # Custom design tokens, teal palette, shadows, animations
├── tsconfig.json                   # TypeScript configuration with @/* path alias
├── tsconfig.node.json              # TypeScript configuration for Vite
├── vite.config.ts                  # Vite build configuration
├── docs/
│   └── UI-SPEC.md                  # Authoritative UI and design specification
├── public/
│   └── favicon.svg                 # Brand favicon
├── reference/                      # UI design references
└── src/
    ├── main.tsx                    # React application entrypoint
    ├── App.tsx                     # React Router routes (/ , /split, /review, /add-people, /assign, /share)
    ├── index.css                   # Global Tailwind utilities and soft neumorphic styles
    ├── vite-env.d.ts               # Vite environment types
    ├── types/
    │   └── index.ts                # TypeScript interfaces (Bill, BillItem, DiningCompanion, PersonShareSummary)
    ├── context/
    │   └── BillContext.tsx         # Unified shared state provider & arithmetic calculation engine
    ├── lib/
    │   ├── gemini.ts               # Google Gemini OCR receipt extraction service
    │   └── utils.ts                # Formatting utilities (cn, formatCurrency, getInitials)
    ├── components/
    │   ├── ui/
    │   │   ├── Badge.tsx           # Status and diner badges
    │   │   ├── Button.tsx          # Neumorphic button variants
    │   │   ├── Card.tsx            # Card container primitives
    │   │   └── LogoIcon.tsx        # Brand SVG icon
    │   ├── landing/
    │   │   ├── Navbar.tsx          # Navigation header with client-side links
    │   │   ├── Hero.tsx            # Hero headline & Get Started CTA
    │   │   ├── ReceiptPreviewCard.tsx # Interactive calculation demo card
    │   │   ├── WorkflowSection.tsx # 4-step workflow overview
    │   │   ├── FeaturesSection.tsx # 2x2 fairness feature grid
    │   │   ├── CtaSection.tsx      # Bottom CTA card
    │   │   └── Footer.tsx          # Footer with disclaimers
    │   ├── split/
    │   │   ├── BillProgressStepper.tsx # 5-step dynamic progress stepper
    │   │   ├── SplitHeader.tsx      # Upload page header
    │   │   ├── UploadDropzone.tsx   # Multi-file dropzone with 5MB validation & rate limiter
    │   │   ├── OCRScannerCard.tsx   # Live laser OCR scan preview & Gemini parser
    │   │   ├── PrivacyNotice.tsx    # Privacy assurance banner
    │   │   ├── DemoBillBanner.tsx   # Quick demo bill launcher
    │   │   ├── InputMethodTabs.tsx  # Upload method tabs
    │   │   └── SplitFeatureCards.tsx # Bottom feature highlight cards
    │   ├── review/
    │   │   ├── ReceiptInfoCard.tsx  # Extracted restaurant metadata card
    │   │   ├── ExtractedItemsTable.tsx # Editable line items table with quantity & price inputs
    │   │   ├── BillSummary.tsx      # Subtotal, Tax %, Service Charge %, and Grand Total summary
    │   │   ├── TotalsValidation.tsx # Arithmetic discrepancy validation card
    │   │   └── ReviewActions.tsx    # Navigation actions (Back to Upload / Continue to Add People)
    │   ├── people/
    │   │   ├── AddPersonForm.tsx    # Diner input form with 8-color avatar picker
    │   │   ├── PersonCard.tsx       # Editable companion card with delete/organizer controls
    │   │   ├── PayerSelectorCard.tsx # Payer designation selector
    │   │   ├── BillContextCard.tsx  # Compact bill context banner
    │   │   ├── GroupSummaryCard.tsx # Group headcount and role summary
    │   │   └── PeopleActions.tsx    # Navigation actions (Back to Review / Continue to Assign Items)
    │   ├── assign/
    │   │   ├── AssignHeaderCard.tsx # Restaurant metadata banner
    │   │   ├── ItemAssignmentCard.tsx # Interactive solo/shared dish assignment card with Select All
    │   │   ├── AssignmentProgressCard.tsx # Dynamic progress bar with filter tabs
    │   │   ├── PersonSharesCard.tsx # Diners summary breakdown
    │   │   ├── AssignmentTotalsCard.tsx # Bill reconciliation balance check card
    │   │   └── AssignActions.tsx    # Navigation actions (Back to Add People / Continue to Share Split)
    │   └── share/
    │       ├── SettlementHeaderCard.tsx # Final restaurant info, payer, and organizer banner
    │       ├── SettlementStatusCard.tsx # Settlement tracker, paid amount, and progress bar
    │       ├── MemberSplitCard.tsx  # Individual diner card with paid toggle and dish accordion
    │       ├── GroupSharingCard.tsx # WhatsApp group bill, copy link, and text summary tools
    │       ├── UpiPaymentModal.tsx  # Dynamic peer-to-peer UPI payment & QR code modal
    │       ├── ShareActions.tsx     # Navigation actions (Back to Assign / PDF / Start New Split)
    │       └── PrintableReceipt.tsx # Monospace print/PDF receipt template
    └── pages/
        ├── LandingPage.tsx          # Route: /
        ├── SplitBillPage.tsx        # Route: /split (Step 1)
        ├── ReviewOCRPage.tsx        # Route: /review (Step 2)
        ├── AddPeoplePage.tsx        # Route: /add-people (Step 3)
        ├── AssignItemsPage.tsx      # Route: /assign (Step 4)
        └── ShareSplitPage.tsx       # Route: /share (Step 5)
```

---

## Local Development

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### 1. Clone & Install
```bash
git clone https://github.com/Jayesh72/split-the-bill.git
cd split-bill
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Google Gemini API key to `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: A pre-filled demo bill is available in the UI to test the complete flow even without an API key).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 4. Build & Preview
```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

### 5. Linting
```bash
npm run lint
```
