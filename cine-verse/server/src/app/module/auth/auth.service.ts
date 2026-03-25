/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { UserStatus } from "../../../generated/prisma/enums.js";
import { auth } from "../../lib/auth.js";
import { ILogin, IRegister } from "./auth.interface.js";
import { IRequestUser } from "../../interface/requestUser.interface.js";
import { prisma } from "../../lib/prisma.js";
import { tokenUtils } from "../../utils/token.js";

const authRegister = async (payload: IRegister) => {
  const { name, email, password } = payload;

  try {
    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!data.user) {
      throw new Error("User registration failed");
    }

    const accessToken = tokenUtils.accessToken({
      userId: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      status: data.user.status,
    });

    const refreshToken = tokenUtils.refreshToken({
      userId: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      status: data.user.status,
    });

    return {
      ...data,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const authLogin = async (payload: ILogin) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.BANNED) {
    throw new Error("User Banned");
  }

  if (data.user.status === UserStatus.SUSPENDED) {
    throw new Error("user has been suspended");
  }

  if (data.user.status === UserStatus.DELETED) {
    throw new Error("User Deleted");
  }

  const accessToken = tokenUtils.accessToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
  });

  const refreshToken = tokenUtils.refreshToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

const authMe = async (user: IRequestUser) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      comments: true,
    },
  });
  if (!userExists) {
    throw new Error("User not found");
  }

  return userExists;
};

const logOut = async (sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authentication: `Bearer ${sessionToken}`,
    }),
  });
  return result;
};

const googleLoginSuccess = async (session: any) => {
  let user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: session.user.name,
        email: session.user.email,
        role: "USER",
        status: "ACTIVE",
      },
    });
  }

  const accessToken = tokenUtils.accessToken({
    userId: user.id,
    role: user.role || "USER",
  });

  const refreshToken = tokenUtils.refreshToken({
    userId: user.id,
    role: user.role || "USER",
  });

  return {
    accessToken,
    refreshToken,
    sessionToken: session.token,
  };
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user?.status === UserStatus.DELETED) {
    throw new Error("user deleted");
  }

  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  });
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new Error("User deleted");
  }

  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    },
  });

  await prisma.session.deleteMany({
    where: {
      userId: user.id,
    },
  });
};

export const authService = {
  authRegister,
  authLogin,
  authMe,
  logOut,
  googleLoginSuccess,
  forgotPassword,
  resetPassword,
};
