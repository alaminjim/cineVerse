import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.authRegister);

router.post("/login", authController.authLogin);

router.get("/me", authController.authMe);

export const authRoute = router;
