
import { UserRole } from "../../generated/prisma/enums.js";
import { envConfig } from "../config/env.js";
import { auth } from "../lib/auth.js";
import { prisma } from "../lib/prisma.js";

export const Admin = async () => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: envConfig.ADMIN_EMAIL,
      },
    });

    if (existingUser) {
      if (existingUser.role !== UserRole.ADMIN) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: UserRole.ADMIN },
        });
      }

      const adminEntry = await prisma.admin.findFirst({
        where: { userId: existingUser.id },
      });
      if (!adminEntry) {
        await prisma.admin.create({
          data: {
            userId: existingUser.id,
            name: "Admin",
            email: envConfig.ADMIN_EMAIL,
          },
        });
      }
      console.log("Admin already exists (role ensured)");
      return;
    }

    const adminData = await auth.api.signUpEmail({
      body: {
        email: envConfig.ADMIN_EMAIL,
        password: envConfig.ADMIN_PASSWORD,
        name: "Admin",
      },
    });

    await prisma.$transaction(async (tx: any) => {
      await tx.user.update({
        where: {
          id: adminData.user.id,
        },
        data: {
          emailVerified: true,
          role: UserRole.ADMIN,
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
