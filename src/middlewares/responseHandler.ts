import { Response, NextFunction } from "express";
export default function (req: Response, res: Response, next: NextFunction) {
  const status = res.statusCode;
  const body = res.json();
  return res.status(status).send({
    errors: [],
    response: body,
  });
}
