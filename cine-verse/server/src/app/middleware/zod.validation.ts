/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import z from "zod";

export const zodValidation = (zodSchema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body?.data) {
        req.body = JSON.parse(req.body.data);
      }

      const parseResult = zodSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: parseResult.error,
        });
      }

      req.body = parseResult.data;

      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format",
      });
    }
  };
};
