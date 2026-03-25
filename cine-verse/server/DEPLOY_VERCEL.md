# Vercel Deployment Guide for CineVerse Backend

Follow these steps to deploy your backend to Vercel.

## 1. Project Configuration
The following files have been added/updated for Vercel:
- `vercel.json`: Handles routing and serverless function configuration.
- `api/index.ts`: The entry point for Vercel functions.
- `package.json`: Added `"postinstall": "prisma generate"` to automate Prisma client creation.

## 2. Environment Variables
You **MUST** add these keys in the [Vercel Dashboard](https://vercel.com/dashboard) → **Settings** → **Environment Variables**:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Your database connection string (use pooled for Supabase/Neon) | `postgresql://...` |
| `BETTER_AUTH_SECRET` | Secret for authentication | Any random string |
| `BETTER_AUTH_URL` | The URL of your backend on Vercel | `https://cine-verse-api.vercel.app` |
| `FRONTEND_URL` | The URL of your frontend on Vercel | `https://cine-verse.vercel.app` |
| `NODE_DEV` | Environment mode | `production` |
| `ADMIN_EMAIL` | Default admin email | `admin@cineverse.com` |
| `ADMIN_PASSWORD` | Default admin password | `YourPassword123` |
| `ACCESS_TOKEN` | JWT Access Token Secret | Random string |
| `REFRESH_TOKEN` | JWT Refresh Token Secret | Random string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary name | |
| `CLOUDINARY_API_KEY` | Cloudinary key | |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | |
| `STRIPE_SECRET_KEY` | Stripe secret | |
| `STRIPE_MONTHLY_PRICE_ID`| Stripe Monthly Price ID | |
| `STRIPE_YEARLY_PRICE_ID` | Stripe Yearly Price ID | |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | |
| `GOOGLE_CALLBACK_URL` | Google Callback | `https://cine-verse-api.vercel.app/api/auth/callback/google` |

## 3. How to Deploy
1. Push your code to a GitHub repository.
2. Link the repository to Vercel.
3. Select the `server` directory as the root.
4. Add the environment variables listed above.
5. Deploy!

> [!IMPORTANT]
> Since this is a serverless environment, the `Admin()` seeding runs automatically on startup to ensure your admin account is always ready.
