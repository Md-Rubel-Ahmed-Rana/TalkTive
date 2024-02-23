import { Request, Response } from "express";
import { IResponse } from "../interfaces/response.interface";

export const sendResponse = (response: IResponse) => {
  return (req: Request, res: Response) => {
    res.status(response.statusCode).json(response);
  };
};
