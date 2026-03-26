<div align="center">
  <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop" width="100%" height="300" style="object-fit: cover; border-radius: 12px;" />
  <br/>
  
  <h1>🎬 CineVerse - Ultimate Movie Streaming & Discovery Portal</h1>
  <p><strong>A modern, full-stack web application designed for discovering, purchasing, and reviewing movies and TV series effortlessly.</strong></p>

  <p>
    <a href="https://cine-verse-client-rouge.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-CineVerse-purple.svg?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
    <a href="https://cine-verse-client-rouge.vercel.app"><img src="https://img.shields.io/badge/Frontend-Next.js%20%7C%20React%2019-black?style=for-the-badge&logo=next.js" alt="Frontend" /></a>
    <a href="https://cine-verse-client-rouge.vercel.app"><img src="https://img.shields.io/badge/Backend-Express.js%20%7C%20Node.js-green?style=for-the-badge&logo=express" alt="Backend" /></a>
    <a href="https://cine-verse-client-rouge.vercel.app"><img src="https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Prisma-blue?style=for-the-badge&logo=postgresql" alt="Database" /></a>
  </p>
</div>

---

## 🚀 Live Links & Credentials

- **Live Application URL:** [CineVerse Live Site](https://cine-verse-client-rouge.vercel.app)
- **Backend API URL:** [CineVerse API](https://cine-verse-server-pi.vercel.app)

### 🔑 Admin Credentials
To fully explore the admin dashboard, movie management, and review approval systems, please log in with the following credentials:
> **Email:** `admin123@gmail.com`  
> **Password:** `12345678Jim`

---

## 🌟 Key Features

### 👤 For Users
- **Secure Authentication:** Seamless login via Email/Password or **Google OAuth** powered by `Better-Auth`.
- **Advanced Movie Discovery:** Search, filter by genres, and sort through a visually stunning cinematic library.
- **Dynamic Watchlists:** Build your personal library by adding/removing titles from your watchlist instantly.
- **Rich Review System:** Leave ratings (1-10), reviews with spoiler tags, and interact with other users' reviews by **liking** and **commenting**.
- **Purchase & Rent Ecosystem:** Buy lifetime access or rent titles for 7 days via integrated **Stripe Checkout**.
- **Subscription Plans:** Unlock unlimited premium streaming with Basic, Standard, and Premium subscription tiers.
- **User Dashboard:** Track payment history, active subscriptions, and your personally reviewed content.

### 🛡️ For Administrators
- **Comprehensive Admin Dashboard:** Real-time analytics charts and statistics on revenue, user growth, and content engagement.
- **Content Management:** Create, edit, and delete movie entries including synopses, trailing platforms, casts, and thumbnails.
- **Review Moderation:** New user reviews are kept in `PENDING` status. Admins can review, approve, or reject submissions before they go public.
- **Admin Auto-Approval:** When an Admin creates a review, it bypasses moderation and is `APPROVED` directly!
- **User Management:** Suspend, delete, or promote users dynamically.

---

## 🛠️ Technology Stack

| Category         | Technologies Used |
|-----------------|-------------------|
| **Frontend**    | Next.js (App Router), React 19, Tailwind CSS, Framer Motion, Axios, Zustand, Lucide React, Recharts |
| **Backend**     | Node.js, Express.js, TypeScript, Better-Auth, Zod, Stripe SDK |
| **Database**    | PostgreSQL (Supabase), Prisma ORM |
| **Integrations**| Stripe (Payments & Subscriptions), Google OAuth, Cloudinary (for potential image handling) |

---

## 📦 Project Setup & Installation

This project is structured as a **Monorepo** containing both the `client` and `server` folders. 

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database Connection URL (e.g. Supabase, Neon)
- Stripe Account (for payment keys)
- Google Cloud Console Project (for OAuth keys)

### 1. Clone the Repository
```bash
git clone https://github.com/alaminjim/cineVerse.git
cd cineVerse
```

### 2. Backend Setup (`/server`)
```bash
cd server
npm install
```

**Create a `.env` file inside the `server` directory:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_postgresql_database_url_here

# Authentication
BETTER_AUTH_SECRET=your_super_secret_auth_string
BETTER_AUTH_URL=http://localhost:5000

# Client URL for CORS
FRONTEND_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_... # Your Stripe Secret Key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Run Database Migrations & Start Server:**
```bash
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend Setup (`/client`)
```bash
cd ../client
npm install
```

**Create a `.env` file inside the `client` directory:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
STRIPE_PUBLIC_KEY=pk_test_... # Your Stripe Publishable Key
```

**Start the Frontend Development Server:**
```bash
npm run dev
```

Your app should now be running locally at `http://localhost:3000` while the backend runs at `http://localhost:5000`.

---

## 🔮 Future Enhancements (Roadmap)
- 🎥 Live Video Streaming implementation
- 🎟️ Theater Ticket Booking System
- 👥 Social Following & Friend Watchlist Sharing

---

<div align="center">
  <p>Crafted with ❤️ and Next.js / Express by <strong>Alamin Jim</strong>.</p>
  <p>If you like this project, consider leaving a ⭐ on the repository!</p>
</div>
<div align="center">
  <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop" width="100%" height="300" style="object-fit: cover; border-radius: 12px;" />
  <br/>
  
  <h1>🎬 CineVerse - Ultimate Movie Streaming & Discovery Portal</h1>
  <p><strong>A modern, full-stack web application designed for discovering, purchasing, and reviewing movies and TV series effortlessly.</strong></p>

  <p>
    <a href="https://cine-verse-client-rouge.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-CineVerse-purple.svg?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
    <a href="https://cine-verse-client-rouge.vercel.app"><img src="https://img.shields.io/badge/Frontend-Next.js%20%7C%20React%2019-black?style=for-the-badge&logo=next.js" alt="Frontend" /></a>
    <a href="https://cine-verse-client-rouge.vercel.app"><img src="https://img.shields.io/badge/Backend-Express.js%20%7C%20Node.js-green?style=for-the-badge&logo=express" alt="Backend" /></a>
    <a href="https://cine-verse-client-rouge.vercel.app"><img src="https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Prisma-blue?style=for-the-badge&logo=postgresql" alt="Database" /></a>
  </p>
</div>

---

## 🚀 Live Links & Credentials

- **Live Application URL:** [CineVerse Live Site](https://cine-verse-client-rouge.vercel.app)
- **Backend API URL:** [CineVerse API](https://cine-verse-server-pi.vercel.app)

### 🔑 Admin Credentials
To fully explore the admin dashboard, movie management, and review approval systems, please log in with the following credentials:
> **Email:** `admin123@gmail.com`  
> **Password:** `12345678Jim`

---

## 🌟 Key Features

### 👤 For Users
- **Secure Authentication:** Seamless login via Email/Password or **Google OAuth** powered by `Better-Auth`.
- **Advanced Movie Discovery:** Search, filter by genres, and sort through a visually stunning cinematic library.
- **Dynamic Watchlists:** Build your personal library by adding/removing titles from your watchlist instantly.
- **Rich Review System:** Leave ratings (1-10), reviews with spoiler tags, and interact with other users' reviews by **liking** and **commenting**.
- **Purchase & Rent Ecosystem:** Buy lifetime access or rent titles for 7 days via integrated **Stripe Checkout**.
- **Subscription Plans:** Unlock unlimited premium streaming with Basic, Standard, and Premium subscription tiers.
- **User Dashboard:** Track payment history, active subscriptions, and your personally reviewed content.

### 🛡️ For Administrators
- **Comprehensive Admin Dashboard:** Real-time analytics charts and statistics on revenue, user growth, and content engagement.
- **Content Management:** Create, edit, and delete movie entries including synopses, trailing platforms, casts, and thumbnails.
- **Review Moderation:** New user reviews are kept in `PENDING` status. Admins can review, approve, or reject submissions before they go public.
- **Admin Auto-Approval:** When an Admin creates a review, it bypasses moderation and is `APPROVED` directly!
- **User Management:** Suspend, delete, or promote users dynamically.

---

## 🛠️ Technology Stack

| Category         | Technologies Used |
|-----------------|-------------------|
| **Frontend**    | Next.js (App Router), React 19, Tailwind CSS, Framer Motion, Axios, Zustand, Lucide React, Recharts |
| **Backend**     | Node.js, Express.js, TypeScript, Better-Auth, Zod, Stripe SDK |
| **Database**    | PostgreSQL (Supabase), Prisma ORM |
| **Integrations**| Stripe (Payments & Subscriptions), Google OAuth, Cloudinary (for potential image handling) |

---

## 📦 Project Setup & Installation

This project is structured as a **Monorepo** containing both the `client` and `server` folders. 

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database Connection URL (e.g. Supabase, Neon)
- Stripe Account (for payment keys)
- Google Cloud Console Project (for OAuth keys)

### 1. Clone the Repository
```bash
git clone https://github.com/alaminjim/cineVerse.git
cd cineVerse
```

### 2. Backend Setup (`/server`)
```bash
cd server
npm install
```

**Create a `.env` file inside the `server` directory:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_postgresql_database_url_here

# Authentication
BETTER_AUTH_SECRET=your_super_secret_auth_string
BETTER_AUTH_URL=http://localhost:5000

# Client URL for CORS
FRONTEND_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_... # Your Stripe Secret Key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Run Database Migrations & Start Server:**
```bash
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Frontend Setup (`/client`)
```bash
cd ../client
npm install
```

**Create a `.env` file inside the `client` directory:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
STRIPE_PUBLIC_KEY=pk_test_... # Your Stripe Publishable Key
```

**Start the Frontend Development Server:**
```bash
npm run dev
```

Your app should now be running locally at `http://localhost:3000` while the backend runs at `http://localhost:5000`.

---

## 🔮 Future Enhancements (Roadmap)
- 🎥 Live Video Streaming implementation
- 🎟️ Theater Ticket Booking System
- 👥 Social Following & Friend Watchlist Sharing

---

<div align="center">
  <p>Crafted with ❤️ and Next.js / Express by <strong>Alamin Jim</strong>.</p>
  <p>If you like this project, consider leaving a ⭐ on the repository!</p>
</div>
