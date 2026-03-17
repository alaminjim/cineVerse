import { auth } from "../../lib/auth";
import { IRegister } from "./auth.interface";

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

export const authService = {
  authRegister,
};
