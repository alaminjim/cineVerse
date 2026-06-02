/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { envConfig } from "../config/env.js";

const Admin = async () => {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: envConfig.ADMIN_EMAIL,
      },
    });

    if (existingAdmin) {
      console.log("Admin user already exists. Skipping seeding.");
      return;
    }

    const { auth } = await import("../lib/auth.js");
    const adminData = await auth.api.signUpEmail({
      body: {
        name: "Admin User",
        email: envConfig.ADMIN_EMAIL,
        password: envConfig.ADMIN_PASSWORD,
      },
    });

    if (adminData.user) {
      let adminUser = await prisma.user.findUnique({
        where: { id: adminData.user.id },
      });

      if (!adminUser) {
        throw new Error("User creation failed");
      }

      if (adminUser.role !== UserRole.ADMIN) {
        adminUser = await prisma.user.update({
          where: { id: adminData.user.id },
          data: { role: UserRole.ADMIN },
        });
      }

      const existingAdminProfile = await prisma.admin.findFirst({
        where: { userId: adminUser.id },
      });

      if (!existingAdminProfile) {
        await prisma.admin.create({
          data: {
            userId: adminUser.id,
            name: "Admin",
            email: envConfig.ADMIN_EMAIL,
          },
        });
      }

      console.log("Admin user created with password:", adminUser.email);
    } else {
      throw new Error("Failed to create admin user");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
    throw error;
  }
};

export { Admin };
