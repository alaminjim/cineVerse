import { UserRole } from "../../generated/prisma/enums";
import { envConfig } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const Admin = async () => {
  try {
    const isExists = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
      },
    });

    if (isExists) {
      console.log("admin already exists");
      return;
    }

    const adminData = await auth.api.signUpEmail({
      body: {
        email: envConfig.ADMIN_EMAIL,
        password: envConfig.ADMIN_PASSWORD,
        name: "Admin",
        role: UserRole.ADMIN,
      },
    });

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: adminData.user.id,
        },
        data: {
          emailVerified: true,
        },
      });

      await tx.admin.create({
        data: {
          userId: adminData.user.id,
          name: "Admin",
          email: envConfig.ADMIN_EMAIL,
        },
      });
    });
    await prisma.admin.findFirst({
      where: {
        email: envConfig.ADMIN_EMAIL,
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.error("Error seeding  admin: ", error);
  }
};
