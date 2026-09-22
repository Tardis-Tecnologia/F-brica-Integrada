import { randomUUID } from "node:crypto";

export function newCorrelationId() {
  return randomUUID();
}

export function auditEntry(input: {
  action: string;
  origin: string;
  entityType: string;
  entityId: string;
  actor: string;
  correlationId?: string;
  before?: unknown;
  after?: unknown;
}) {
  return {
    ...input,
    correlationId: input.correlationId ?? newCorrelationId(),
    beforeJson: input.before ? JSON.stringify(input.before) : null,
    afterJson: input.after ? JSON.stringify(input.after) : null,
    createdAt: new Date(),
  };
}

export function maskSecret(value?: string | null) {
  if (!value) return "";
  if (value.length <= 6) return "***";
  return `${value.slice(0, 3)}***${value.slice(-2)}`;
}
