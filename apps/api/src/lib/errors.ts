export type DomainErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INVALID_CREDENTIALS"
  | "IDENTITY_CONFLICT"
  | "DEVICE_BINDING_CONFLICT"
  | "DEVICE_NOT_RECOGNIZED"
  | "OUTSIDE_GEOFENCE"
  | "SESSION_CLOSED"
  | "SESSION_NOT_ACTIVE"
  | "ALREADY_CHECKED_IN"
  | "DELEGATION_EXPIRED"
  | "DELEGATION_NOT_ALLOWED"
  | "INTERNAL_SERVER_ERROR";

export class DomainError extends Error {
  public readonly code: DomainErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(code: DomainErrorCode, message: string, statusCode = 400, details?: Record<string, unknown>) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
