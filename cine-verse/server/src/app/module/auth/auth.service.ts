import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { ILogin, IRegister } from "./auth.interface";

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

    return {
      success: true,
      message: "User registered successfully",
      data: data.user,
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

  return data;
};

export const authService = {
  authRegister,
  authLogin,
};
