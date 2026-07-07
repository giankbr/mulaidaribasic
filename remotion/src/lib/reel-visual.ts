export type ReelVisual =
  | "hook"
  | "cta"
  | "nodes"
  | "stack"
  | "pipeline"
  | "layers"
  | "di"
  | "dto"
  | "api"
  | "paths"
  | "learn"
  | "project";

export function pickReelVisual(headline: string, body?: string): ReelVisual {
  const text = `${headline} ${body ?? ""}`.toLowerCase();

  // Belajar IT / career (before generic tech patterns)
  if (/bootcamp|kursus|kelas|mentor|mahal|jalan pintas/.test(text)) return "paths";
  if (/dokumentasi|youtube|tutorial|gratis|roadmap|pemula/.test(text)) return "learn";
  if (/proyek|project|github|deploy|sertifikat|portfolio|rekruter/.test(text)) return "project";
  if (/belajar|fundamental|konsep dasar|mindset/.test(text)) return "learn";

  if (/\bdto\b|validasi|validation|payload|class-validator/.test(text)) return "dto";
  if (/dependency injection|\binject\b|injection|providers?/.test(text)) return "di";
  if (/controller|service layer|repository|logika bisnis|pisahkan/.test(text)) return "layers";
  if (/monolith|modular|mvp/.test(text)) return "stack";
  if (/microservice|monitoring|koordinasi|overhead deploy|pecah service/.test(text)) return "nodes";
  if (/pipeline|ci\/?cd|\bbuild\b|\bdeploy\b/.test(text)) return "pipeline";
  if (/\bapi\b|endpoint|rest|crud|nestjs|\bhttp\b/.test(text)) return "api";

  return "hook";
}
