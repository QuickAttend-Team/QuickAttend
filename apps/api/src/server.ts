import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { DomainError } from "./lib/errors.js";

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "@quickattend/api",
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof DomainError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  const message = err instanceof Error ? err.message : "Internal Server Error";
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message,
    },
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log(`[QuickAttend API] Server is running on port ${env.PORT}`);
  });
}

export default app;
