export type ReelVisual =
  | "hook"
  | "cta"
  | "nodes"
  | "stack"
  | "pipeline"
  | "layers"
  | "di"
  | "dto"
  | "api";

export function pickReelVisual(headline: string, body?: string): ReelVisual {
  const text = `${headline} ${body ?? ""}`.toLowerCase();

  if (/\bdto\b|validasi|validation|payload|class-validator/.test(text)) return "dto";
  if (/dependency injection|\binject\b|injection|providers?/.test(text)) return "di";
  if (/controller|service layer|repository|logika bisnis|pisahkan/.test(text)) return "layers";
  if (/monolith|modular|mvp/.test(text)) return "stack";
  if (/microservice|monitoring|koordinasi|overhead deploy|pecah service/.test(text)) return "nodes";
  if (/pipeline|ci\/?cd|\bbuild\b|\bdeploy\b/.test(text)) return "pipeline";
  if (/\bapi\b|endpoint|rest|crud|nestjs/.test(text)) return "api";

  return "layers";
}
