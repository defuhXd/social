// utils/uid.ts
let counter = 0;
export function generateUid(): string {
  return Math.random().toString(36).substring(2, 11);
}
