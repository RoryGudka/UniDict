import { getItem, putItem } from "../database";

import { ApiResponse } from "../api/ApiResponse";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Provider } from "../model";
import { apiHandler } from "../api/apiHandler";
import express from "express";

interface EntryModifier {
  name: string;
  prompt: string;
}

interface LanguageSettings {
  entryGenerationPrompt: string;
  entryModifiers: EntryModifier[];
  translationGenerationPrompt: string;
}

interface User {
  id: string;
  email: string;
  nativeLanguage: string;
  learningLanguages: { [language: string]: LanguageSettings };
  learningLanguage: string;
  provider: Provider;
  updatedAt: string;
}

const router = express.Router();

const dynamoDB = new DynamoDB({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Get user profile
router.get(
  "/:userId",
  apiHandler(async (context) => {
    const { user } = context;

    const item = await getItem<User>({
      tableName: "UnidictionaryUsers",
      key: { id: user.sub },
    });

    return ApiResponse.ok(item || {});
  })
);

// Update user profile
router.put(
  "/",
  apiHandler(async ({ req, user }) => {
    const { nativeLanguage, learningLanguages, learningLanguage, provider } =
      req.body;

    await putItem<User>({
      tableName: "UnidictionaryUsers",
      item: {
        id: user.sub,
        email: user.email?.toString() || "",
        nativeLanguage,
        learningLanguages,
        learningLanguage,
        provider,
        updatedAt: new Date().toISOString(),
      },
    });

    return ApiResponse.ok({});
  })
);

export default router;
