const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phonePattern =
  /\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?){2}\d{4}\b/g;
const cardPattern = /\b(?:\d[ -]*?){13,19}\b/g;

export function scrub(input: string): string {
  return input
    .replace(emailPattern, "[redacted-email]")
    .replace(phonePattern, "[redacted-phone]")
    .replace(cardPattern, "[redacted-card]");
}
