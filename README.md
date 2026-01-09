# Master Neon – Custom Neon Sign Builder

Master Neon is a modern web application for designing custom neon signs. Customers can create name signs, logo signs, or choose from ready-made templates, preview their designs in real-time, download PDFs, and submit requests directly to designers.

## ✨ Features

- **3 Design Categories:**
  - **Name Sign Designer**: Custom text with emoji support, 12 neon fonts, color selection, and size options
  - **Logo Sign Designer**: Upload images or pick emojis with neon outline effects and brightness control
  - **Default Neon Designs**: Ready-made templates (Happy Birthday, Welcome, etc.) with customization options

- **Real-time Preview**: Live neon glow effects using HTML5 Canvas
- **PDF Generation**: Download design specifications as PDF with customer details and preview image
- **Email Integration**: Send design requests directly to Master Neon designers via email
- **No Authentication Required**: Completely open system - no login, signup, or admin dashboard needed

## 🛠 Tech Stack

- **Frontend:** React + Vite + TypeScript, TailwindCSS, Framer Motion
- **Preview Engine:** HTML5 Canvas with neon glow effects
- **PDF Generation:** jsPDF + html2canvas
- **Backend:** Node.js + Express (email sending only, no database)
- **Email:** Nodemailer

## 📁 Project Structure

```
Project/
├─ client/              # React + Vite frontend
│  ├─ src/
│  │  ├─ components/   # Reusable components
│  │  │  ├─ builder/   # Neon preview canvas
│  │  │  ├─ common/    # Buttons, etc.
│  │  │  ├─ layout/    # Footer, SiteLayout
│  │  │  └─ navigation/# NavBar
│  │  ├─ pages/        # Home, Builder, About, Contact
│  │  ├─ data/         # Fonts, colors, templates
│  │  ├─ types/        # TypeScript types
│  │  ├─ utils/        # PDF generator
│  │  └─ services/     # API client
│  └─ package.json
├─ server/             # Express API
│  ├─ src/
│  │  ├─ controllers/ # Request handlers
│  │  ├─ routes/       # API routes
│  │  ├─ services/    # Email service
│  │  └─ middleware/   # Error handling
│  └─ package.json
└─ README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 10+
- Email account for sending notifications (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd ../server
   npm install
   ```

### Configuration

1. **Backend Environment Variables:**

   Create a `.env` file in the `server/` directory:
   ```bash
   cd server
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   PORT=5000
   ALLOW_ORIGINS=http://localhost:5173
   
   # Email Configuration (for sending designer emails)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   
   # Master Neon Designer Email (where design requests are sent)
   DESIGNER_EMAIL=designer@masterneon.com
   ```

   **Note:** Email configuration is optional. The server will run without it, but emails won't be sent.

2. **Frontend Environment Variables (Optional):**

   If your backend runs on a different URL, create a `.env` file in `client/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 📡 API Endpoints

- `POST /api/neon-request` - Submit a custom neon design request
- `POST /api/contact` - Send a contact form message
- `GET /api/health` - Health check endpoint

## 🎨 Usage

1. **Navigate to Builder**: Click "Create Your Neon" or go to `/builder`
2. **Choose Category**: Select Name Sign, Logo Sign, or Default Designs tab
3. **Customize**: Adjust text, fonts, colors, size, etc.
4. **Preview**: See real-time neon glow effects
5. **Download PDF**: Click "Download PDF" to save your design specification
6. **Send to Designer**: Fill in customer details and submit to send email to designers

## 📄 PDF Generation

The PDF includes:
- Customer details (name, email, phone, notes)
- Neon sign details (category, font, color, size, etc.)
- Design preview image (captured from canvas)

PDFs are generated client-side using jsPDF and html2canvas.

## ✉️ Email Notifications

When a customer submits a design request:
- An email is sent to `DESIGNER_EMAIL` with:
  - Customer contact information
  - Complete design specifications
  - Preview image attachment (base64 PNG)

## 🎯 Design Features

### Name Sign Designer
- Text input (up to 30 characters)
- Emoji support (can include emojis in text)
- 12 neon-style fonts
- 6 color options
- 3 size presets

### Logo Sign Designer
- Image upload (PNG/JPG)
- Emoji picker (30+ options)
- Neon color outline
- Brightness/intensity slider (0-100%)
- Size selection

### Default Designs
- 5 ready-made templates:
  - Happy Birthday
  - Welcome
  - Happy Anniversary
  - Open
  - Love
- Color customization
- Size selection

## 🎨 UI/UX

- Dark neon-themed design with glassmorphism effects
- Smooth animations with Framer Motion
- Fully responsive mobile layout
- Real-time preview updates
- Intuitive tab-based navigation

## 📝 Notes

- No database required - all data is sent via email
- No authentication - completely open system
- Canvas previews are exported as base64 PNG images
- PDF generation happens entirely client-side
- Email configuration is optional but recommended

## 🔧 Development

- Frontend uses Vite for fast HMR
- Backend uses Nodemon for auto-restart
- TypeScript for type safety
- TailwindCSS for styling

## 📦 Production Build

```bash
# Build frontend
cd client
npm run build

# Start backend
cd ../server
npm run start
```

Frontend build output: `client/dist/`

---

**Enjoy lighting up the world with Master Neon!** ✨
