/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, RequestHandler, Response } from "express";

const catchFunction = (sharedFn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await sharedFn(req, res, next);
    } catch (error: any) {
      next(error);
    }
  };
};

export default catchFunction;
