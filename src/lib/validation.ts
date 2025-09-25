export function isValidEmail(email: string): boolean {
  const value = (email || "").trim();
  if (!value) return false;
  // Basic robust email regex
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailPattern.test(value);
}

export function normalizeEmail(email: string): string {
  return (email || "").trim().toLowerCase();
}
