import { NextFunction, Request, Response } from "express";

import { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";

export interface ApiHandlerResponse {
  statusCode: number;
  body: string;
}

export interface ApiContext {
  req: Request;
  res: Response;
  next: NextFunction;
  user: CognitoIdTokenPayload;
}
