export type ReceivableStatus =
  | "OPEN"
  | "DUE_SOON"
  | "DUE_TODAY"
  | "OVERDUE"
  | "PAID"
  | "CANCELLED";

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function daysUntilDue(due: Date, now = new Date()) {
  const a = startOfDay(due).getTime();
  const b = startOfDay(now).getTime();
  return Math.round((a - b) / 86400000);
}

export function receivableStatus(input: {
  dueDate: Date;
  paymentDate?: Date | null;
  cancelled?: boolean;
  now?: Date;
}): ReceivableStatus {
  if (input.cancelled) return "CANCELLED";
  if (input.paymentDate) return "PAID";
  const days = daysUntilDue(input.dueDate, input.now ?? new Date());
  if (days < 0) return "OVERDUE";
  if (days === 0) return "DUE_TODAY";
  if (days <= 3) return "DUE_SOON";
  return "OPEN";
}

export function agingBucket(due: Date, now = new Date()) {
  const days = -daysUntilDue(due, now);
  if (days <= 0) return days === 0 ? "due_today" : "upcoming";
  if (days <= 3) return "overdue_1_3";
  if (days <= 7) return "overdue_4_7";
  if (days <= 30) return "overdue_8_30";
  return "overdue_30_plus";
}
