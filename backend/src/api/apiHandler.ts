import { ApiContext, ApiHandlerResponse } from "@/api/model";
import { NextFunction, Request, Response } from "express";

import { ApiError } from "@/api/ApiError";
import { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!,
  tokenUse: "id",
  clientId: process.env.USER_POOL_CLIENT_ID!,
});

export const apiHandler =
  (callback: (context: ApiContext) => Promise<ApiHandlerResponse>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let user: CognitoIdTokenPayload | null = null;

    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "No token provided" });

      user = await verifier.verify(token);
      console.info("User authenticated:", user.sub);
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ error: "Invalid token" });
    }

    try {
      if (!user) throw ApiError.unauthorized("No user found");
      const { statusCode, body } = await callback({ req, res, next, user });
      return res.status(statusCode).json(JSON.parse(body));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error:" });
    }
  };
