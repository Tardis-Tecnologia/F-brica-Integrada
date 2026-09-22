import { daysUntilDue } from "./receivable";

export type CollectionRule = {
  id: string;
  offsetDays: number;
  channel: "internal" | "whatsapp";
  template: string;
  audience: "internal" | "customer";
  priority: number;
  active: boolean;
  hourFrom: number;
  hourTo: number;
};

export function inSendingWindow(rule: CollectionRule, now = new Date()) {
  const h = now.getHours();
  return h >= rule.hourFrom && h < rule.hourTo;
}

export function dueCollectionActions(input: {
  dueDate: Date;
  paid?: boolean;
  rules: CollectionRule[];
  alreadySentRuleIds: string[];
  now?: Date;
}) {
  if (input.paid) return [];
  const now = input.now ?? new Date();
  const days = daysUntilDue(input.dueDate, now);
  return input.rules
    .filter((r) => r.active)
    .filter((r) => r.offsetDays === days)
    .filter((r) => inSendingWindow(r, now))
    .filter((r) => !input.alreadySentRuleIds.includes(r.id))
    .sort((a, b) => b.priority - a.priority);
}
