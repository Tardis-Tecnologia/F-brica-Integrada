export type SlaRule = {
  id: string;
  fromStep: string;
  toStep: string;
  slaMinutes: number;
  severity: "INFO" | "WARNING" | "CRITICAL";
  active: boolean;
};

export type TimelineStep = {
  code: string;
  status: "pending" | "running" | "done" | "late";
  startedAt?: Date | null;
  finishedAt?: Date | null;
};

export function stepDurationMinutes(step: TimelineStep, now = new Date()) {
  if (!step.startedAt) return 0;
  const end = step.finishedAt ?? now;
  return (end.getTime() - step.startedAt.getTime()) / 60000;
}

export function evaluateSla(step: TimelineStep, rule: SlaRule, now = new Date()) {
  if (!rule.active) return null;
  if (step.code !== rule.toStep && step.code !== rule.fromStep) return null;
  if (step.status === "done") return null;
  if (!step.startedAt) return null;
  const minutes = stepDurationMinutes(step, now);
  if (minutes <= rule.slaMinutes) return null;
  return {
    type: "sla_breach",
    severity: rule.severity,
    ruleId: rule.id,
    message: `SLA ${rule.fromStep} → ${rule.toStep} estourado em ${Math.round(minutes - rule.slaMinutes)} min`,
    overdueMinutes: minutes - rule.slaMinutes,
  };
}
