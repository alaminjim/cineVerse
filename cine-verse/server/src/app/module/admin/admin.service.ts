/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "../../lib/prisma.js";
import { UserStatus } from "../../../generated/prisma/enums.js";
import { IRequestUser } from "../../interface/requestUser.interface.js";
import { IAdminUpdate } from "./admin.interface.js";

const getAllAdmin = async () => {
  const result = await prisma.admin.findMany({
    where: {
      isDeleted: false,
    },
  });

  return result;
};

const getIdByAdmin = async (id: string) => {
  const isExists = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isExists) {
    throw new Error("Admin Not Found");
  }

  return isExists;
};

const updateAdmin = async (payload: IAdminUpdate, id: string) => {
  const isExists = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  if (!isExists) {
    throw new Error("Admin Not Found");
  }

  if (isExists.isDeleted) {
    throw new Error("Admin Data has been deleted");
  }

  const update = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });

  return update;
};

const updateStatus = async (payload: IAdminUpdate, statusId: string) => {
  const isExists = await prisma.user.findFirst({
    where: {
      id: statusId,
    },
  });

  if (!isExists) {
    throw new Error("This user can not found");
  }

  if (isExists.role === "ADMIN") {
    throw new Error("Cannot change status of an admin user");
  }

  return await prisma.user.update({
    where: {
      id: statusId,
    },
    data: {
      status: payload.status,
    },
  });
};

const adminDeleted = async (id: string, user: IRequestUser) => {
  const adminExists = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!adminExists) {
    throw new Error("Admin not found");
  }

  if (adminExists.id === user.userId) {
    throw new Error("You cannot delete yourself");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: {
        id: adminExists.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: {
        userId: adminExists.userId,
      },
    });

    await tx.account.deleteMany({
      where: {
        userId: adminExists.userId,
      },
    });

    const admin = await getIdByAdmin(id);

    return admin;
  });
  return result;
};

export const adminService = {
  getAllAdmin,
  getIdByAdmin,
  updateAdmin,
  updateStatus,
  adminDeleted,
};
