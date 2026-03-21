/* eslint-disable @typescript-eslint/no-unused-vars */

import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { ILogin, IRegister } from "./auth.interface";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const googleLoginSuccess = async (session: any) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        name: session.user.name,
        email: session.user.email,
      },
    });
  }

  const accessToken = tokenUtils.accessToken({
    userId: session.user.id,
    role: session.user.role || "USER",
  });

  const refreshToken = tokenUtils.refreshToken({
    userId: session.user.id,
    role: session.user.role || "USER",
  });

  return { accessToken, refreshToken };
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
