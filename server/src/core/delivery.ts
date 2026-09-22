export type DeliveryRule = {
  requireSlot: boolean;
  hourFrom: number;
  hourTo: number;
  weekDays: number[];
  maxWeightKg?: number | null;
  vehicleHint?: string | null;
};

export type ShipmentDraft = {
  scheduledAt?: Date | null;
  weightKg?: number | null;
  vehicle?: string | null;
};

export function validateDelivery(rule: DeliveryRule, draft: ShipmentDraft) {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (rule.requireSlot && !draft.scheduledAt) {
    errors.push("Destino exige agendamento e não existe agendamento cadastrado.");
  }

  if (draft.scheduledAt) {
    const h = draft.scheduledAt.getHours();
    const day = draft.scheduledAt.getDay();
    if (h < rule.hourFrom || h >= rule.hourTo) {
      errors.push(`Fora da janela ${rule.hourFrom}h–${rule.hourTo}h.`);
    }
    if (!rule.weekDays.includes(day)) {
      errors.push("Dia da semana não permitido para este local.");
    }
  }

  if (rule.maxWeightKg && draft.weightKg && draft.weightKg > rule.maxWeightKg) {
    warnings.push("Veículo/carga excede o limite de peso do local.");
  }

  return { ok: errors.length === 0, errors, warnings };
}
