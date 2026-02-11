const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phonePattern = /\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?){2}\d{4}\b/g;
const cardPattern = /\b(?:\d[ -]*?){13,19}\b/g;

/**
 * PII Scrubbing Utility
 * Redacts emails, phone numbers, and credit card numbers from string or object inputs.
 */
export function scrub(input: any): string {
  if (input === null || input === undefined) return "";

  const s = typeof input === "string" ? input : JSON.stringify(input);

  return s
    .replace(emailPattern, "[redacted-email]")
    .replace(phonePattern, "[redacted-phone]")
    .replace(cardPattern, "[redacted-card]");
}
