import { NextFunction, Request, Response } from "express";
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from "routing-controllers";
import { ValidationError } from "class-validator";
import { BookFilesDTO } from "../../interfaces/dto";
import { deleteFile } from "../../utils/files";

@Middleware({ type: "after" })
export class FailedUploadsMiddleware
  implements ExpressErrorMiddlewareInterface
{
  error(error: any, request: Request, response: Response, next: NextFunction) {
    if (
      Array.isArray(error.errors) &&
      error.errors?.[0] instanceof ValidationError
    ) {
      try {
        const files = request.files as unknown as BookFilesDTO;
        Object.values(files).forEach((file) => {
          deleteFile(file[0].path);
        });
      } catch (err) {
        console.error(err);
      }
    }

    next(error);
  }
}
