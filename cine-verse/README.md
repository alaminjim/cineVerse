<div align="center">
  <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop" width="100%" height="300" style="object-fit: cover; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);" />
  <br/>
  
  <h1>🌟 CineVerse - Ultimate Cinematic Ecosystem</h1>
  <p><strong>A Premium Full-Stack Movie Streaming & Discovery Platform with AI-Enhanced Search</strong></p>

  <p>
    <a href="https://cine-verse-client-rouge.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-CineVerse-purple.svg?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
    <a href="https://cine-verse-client-rouge.vercel.app"><img src="https://img.shields.io/badge/Frontend-Next.js%2015-black?style=for-the-badge&logo=next.js" alt="Frontend" /></a>
    <a href="https://cine-verse-client-rouge.vercel.app"><img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20PostgreSQL-blue?style=for-the-badge&logo=postgresql" alt="Database" /></a>
  </p>
</div>

---

## 🚀 Deployment Links

| Resource | URL |
|----------|-----|
| **Live Application** | [https://cine-verse-client-rouge.vercel.app](https://cine-verse-client-rouge.vercel.app) |
| **Backend API** | [https://cine-verse-server-pi.vercel.app](https://cine-verse-server-pi.vercel.app) |

---

## 🔑 Access Credentials

> [!IMPORTANT]
> Use the credentials below to explore the different permission levels of the platform.

### 🛡️ Administrator Account
**Access Level:** Full CRUD on Movies, Review Moderation, User Management, Analytics.
- **Email:** `admin123@gmail.com`
- **Password:** `12345678Jim`

### 👤 Standard User Account
**Access Level:** Watchlists, Movie Reviews, Comments, Subscriptions, and Profile Management.
- **Email:** `tommy@gmail.com`
- **Password:** `12345678Jim`

---

## 💎 Industry Standard Features

### 🤖 AI-Powered Intelligence
- **Instant Search Suggestions:** Custom logic that triggers AI recommendations starting from just **1 character**.
- **Synapse Generation:** Integrated Gemini AI for generating professional movie synopses and descriptions.
- **CineBuddy Assistant:** A smart chatbot to help users find the perfect movie based on their mood.

### 📱 Responsive & Premium UI
- **Fully Responsive Design:** Optimized for **Mobile**, **Tablet**, and **Desktop** viewports.
- **Glassmorphic Navigation:** Modern fixed navbar with backdrop-blur effects and a redesigned mobile menu.
- **Dark-Themed Majesty:** A consistent, high-contrast dark aesthetic for an eye-strain-free cinematic experience.

### 🎥 Core Functionalities
- **Dynamic Content:** Real-time updates for New Releases, Top Rated, and All Movies sectors.
- **Subscription Engine:** Monthly and Yearly premium plans with integrated checkout flow.
- **Watchlist System:** Persistent user-specific watchlists with instant add/remove feedback.
- **Review Moderation:** Comprehensive system where user reviews are moderated by admins before appearing publicly.

---

## 🛠️ Technology Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 15 (App Router), React, Tailwind CSS, Framer Motion, Axios, Zustand |
| **Backend** | Node.js, Express.js, TypeScript, Prisma ORM, Better-Auth, Zod |
| **Database** | PostgreSQL (Supabase / Neon) |
| **AI** | Google Gemini AI API |
| **Styling** | Vanilla Tailwind CSS (Dark Mode focused) |

---

## 📦 Local Installation

### 1. Clone & Install
```bash
git clone https://github.com/alaminjim/cineVerse.git
cd cineVerse
```

### 2. Backend Setup (`/server`)
```bash
cd server
npm install
# Create .env with DATABASE_URL, BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID, etc.
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend Setup (`/client`)
```bash
cd ../client
npm install
# Create .env with NEXT_PUBLIC_API_URL
npm run dev
```

---

<div align="center">
  <p>Engineered with precision by <strong>Alamin Jim</strong>.</p>
  <p>If this project inspires you, consider giving it a ⭐!</p>
</div>
