import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware(), adminController.getAllAdmin);

router.get("/:id", authMiddleware(), adminController.getIdByAdmin);

router.patch("/:id", authMiddleware(), adminController.updateAdmin);

router.delete("/:id", authMiddleware(), adminController.deleteAdmin);

export const adminRoute = router;
