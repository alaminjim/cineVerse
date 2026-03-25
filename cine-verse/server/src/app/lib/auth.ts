import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { UserRole, UserStatus } from "../../generated/prisma/enums.js";
import { envConfig } from "../config/env.js";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email.js";

export const auth = betterAuth({
  baseURL: envConfig.BETTER_AUTH_URL,
  secret: envConfig.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    bearer(),

    emailOTP({
      overrideDefaultEmailVerification: true,

      async sendVerificationOTP({ email, otp, type }) {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return;

        if (type === "forget-password") {
          await sendEmail({
            to: email,
            subject: "Reset your password",
            templateName: "otp",
            templateData: {
              name: user.name,
              otp,
            },
          });
        }
      },

      expiresIn: 2 * 60,
      otpLength: 6,
    }),
  ],

  socialProviders: {
    google: {
      clientId: envConfig.GOOGLE_CLIENT_ID!,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET!,

      mapProfileToUser() {
        return {
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          isDeleted: false,
        };
      },
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.USER,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
      },
    },
  },

  redirectURLs: {
    signIn: `${envConfig.BETTER_AUTH_URL}/api/v1/auth/google/success`,
  },

  trustedOrigins: [
    envConfig.BETTER_AUTH_URL,
    envConfig.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5000",
  ],

  session: {
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60 * 24,

    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24,
    },
  },

  advanced: {
    useSecureCookies: false,

    cookies: {
      state: {
        attributes: {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
        },
      },
      sessionToken: {
        attributes: {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
        },
      },
    },
  },
});
