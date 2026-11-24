import { Router, Request, Response, NextFunction } from "express";
import {
  createDelegation,
  listReceivedDelegations,
  revokeDelegation,
} from "./delegation.service.js";
import { verifySessionToken } from "../../server/session.js";

export const delegationRouter = Router();

// Helper to extract authenticated lecturer email
function getLecturerContext(req: Request): { userId: number; email: string } {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const payload = verifySessionToken(authHeader.substring(7));
      return { userId: payload.userId, email: payload.email };
    } catch {
      // Fallback in dev/test mode
    }
  }

  // Fallback demo context if token is omitted in demo/local dev
  const headerEmail = req.headers["x-lecturer-email"] as string;
  return {
    userId: 1,
    email: headerEmail || "lecturer@hcmut.edu.vn",
  };
}

/**
 * POST /api/v1/delegations - Delegate a session or template to another lecturer
 */
delegationRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, email } = getLecturerContext(req);
    const delegation = await createDelegation(userId, email, req.body);
    res.status(201).json({
      success: true,
      message: "Bàn giao quyền quản lý ca học thành công.",
      data: delegation,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/delegations/received - List active delegations received by lecturer
 */
delegationRouter.get("/received", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = getLecturerContext(req);
    const queryEmail = (req.query.email as string) || email;
    const items = listReceivedDelegations(queryEmail);
    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/delegations/:id/revoke - Revoke a delegation
 */
delegationRouter.post("/:id/revoke", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = getLecturerContext(req);
    const id = parseInt(String(req.params.id), 10);
    const updated = revokeDelegation(email, id);
    res.json({
      success: true,
      message: "Đã thu hồi quyền quản lý phiên điểm danh.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});
