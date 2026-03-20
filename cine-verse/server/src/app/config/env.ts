import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  NODE_DEV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  FRONTEND_URL: string;
  ACCESS_TOKEN: string;
  REFRESH_TOKEN: string;
  ACCESS_TOKEN_IN: string;
  REFRESH_TOKEN_IN: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
  STRIPE_SECRET_KEY: string;
  STRIPE_MONTHLY_PRICE_ID: string;
  STRIPE_YEARLY_PRICE_ID: string;
}

const envVariables = (): EnvConfig => {
  const requireEnv = [
    "NODE_DEV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "FRONTEND_URL",
    "ACCESS_TOKEN",
    "REFRESH_TOKEN",
    "ACCESS_TOKEN_IN",
    "REFRESH_TOKEN_IN",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_MONTHLY_PRICE_ID",
    "STRIPE_YEARLY_PRICE_ID",
  ];

  requireEnv.forEach((variable) => {
    if (!process.env[variable]) {
      console.log("");
    }
  });

  return {
    NODE_DEV: process.env.NODE_DEV as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN as string,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN as string,
    ACCESS_TOKEN_IN: process.env.ACCESS_TOKEN_IN as string,
    REFRESH_TOKEN_IN: process.env.REFRESH_TOKEN_IN as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    STRIPE_MONTHLY_PRICE_ID: process.env.STRIPE_MONTHLY_PRICE_ID as string,
    STRIPE_YEARLY_PRICE_ID: process.env.STRIPE_YEARLY_PRICE_ID as string,
  };
};

export const envConfig = envVariables();
