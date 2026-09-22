export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = "pt-BR";
  u.rate = 1;
  window.speechSynthesis.speak(u);
}

export function stopSpeak() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function pageSpeech(title: string, subtitle: string) {
  const page = document.querySelector(".page");
  const lead = page?.querySelector(".lead")?.textContent ?? "";
  const kpis = [...(page?.querySelectorAll(".kpi") ?? [])]
    .slice(0, 6)
    .map((el) => el.textContent?.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(". ");
  return [title, subtitle, lead, kpis].filter(Boolean).join(". ");
}
