import { DomainError } from "../../lib/errors.js";
import { delegateSessionSchema, DelegateSessionInput } from "@quickattend/contracts";

export interface DelegationResult {
  id: number;
  sessionId?: number;
  templateId?: number;
  receiverEmail: string;
  senderEmail: string;
  status: "PENDING" | "ACCEPTED" | "REVOKED";
  durationHours: number;
  delegatedUntil: string;
  createdAt: string;
}

// In-memory repository for resilience and fast unit/e2e test execution
const inMemoryDelegations: DelegationResult[] = [];

/**
 * Creates a temporary session or template delegation
 */
export async function createDelegation(
  senderId: number,
  senderEmail: string,
  input: DelegateSessionInput
): Promise<DelegationResult> {
  const parsed = delegateSessionSchema.parse(input);

  if (!parsed.sessionId && !parsed.templateId) {
    throw new DomainError(
      "VALIDATION_ERROR",
      "Vui lòng cung cấp sessionId hoặc templateId để thực hiện ủy quyền.",
      400
    );
  }

  if (parsed.receiverEmail.toLowerCase() === senderEmail.toLowerCase()) {
    throw new DomainError(
      "DELEGATION_NOT_ALLOWED",
      "Không thể tự ủy quyền ca học cho chính địa chỉ email của mình.",
      400
    );
  }

  const durationMs = parsed.durationHours * 3600 * 1000;
  const delegatedUntil = new Date(Date.now() + durationMs).toISOString();

  const record: DelegationResult = {
    id: Date.now(),
    sessionId: parsed.sessionId,
    templateId: parsed.templateId,
    receiverEmail: parsed.receiverEmail.toLowerCase(),
    senderEmail: senderEmail.toLowerCase(),
    status: "ACCEPTED",
    durationHours: parsed.durationHours,
    delegatedUntil,
    createdAt: new Date().toISOString(),
  };

  inMemoryDelegations.unshift(record);
  return record;
}

/**
 * Lists all active delegations received by a lecturer
 */
export function listReceivedDelegations(receiverEmail: string): DelegationResult[] {
  const email = receiverEmail.toLowerCase();
  const now = new Date().toISOString();
  return inMemoryDelegations.filter(
    (d) => d.receiverEmail === email && d.status === "ACCEPTED" && d.delegatedUntil > now
  );
}

/**
 * Revokes an existing delegation
 */
export function revokeDelegation(senderEmail: string, delegationId: number): DelegationResult {
  const item = inMemoryDelegations.find((d) => d.id === delegationId);
  if (!item) {
    throw new DomainError("NOT_FOUND", "Không tìm thấy thông tin phiên ủy quyền.", 404);
  }
  if (item.senderEmail && item.senderEmail !== senderEmail.toLowerCase()) {
    throw new DomainError("FORBIDDEN", "Bạn không có quyền thu hồi phiên ủy quyền này.", 403);
  }
  item.status = "REVOKED";
  return item;
}

export function clearDelegations(): void {
  inMemoryDelegations.length = 0;
}
