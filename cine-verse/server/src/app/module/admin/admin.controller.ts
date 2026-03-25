import { StatusCodes } from "http-status-codes";
import { adminService } from "./admin.service.js";
import { Request, Response } from "express";
import catchFunction from "../../shared/catchFunction.js";

const getAllAdmin = catchFunction(async (req: Request, res: Response) => {
  const result = await adminService.getAllAdmin();
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const getIdByAdmin = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.getIdByAdmin(id as string);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const updateAdmin = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await adminService.updateAdmin(payload, id as string);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const updateStatus = catchFunction(async (req: Request, res: Response) => {
  const { statusId } = req.params;
  const payload = req.body;
  const result = await adminService.updateStatus(payload, statusId as string);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const deleteAdmin = catchFunction(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = req?.user;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const result = await adminService.adminDeleted(id as string, user);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

export const adminController = {
  getAllAdmin,
  getIdByAdmin,
  updateAdmin,
  updateStatus,
  deleteAdmin,
};
