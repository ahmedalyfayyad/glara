/** Tiny classnames joiner — no need for a dependency. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const ORDER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(length: number): string {
  let out = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) out += ORDER_ALPHABET[bytes[i] % ORDER_ALPHABET.length];
  return out;
}

/** GLR-7K2M4Q — short enough to read down the phone, long enough to be unguessable. */
export function orderNumber(): string {
  return `GLR-${randomCode(7)}`;
}

/** CFG-4B7X — the code a customer quotes when they call about a saved build. */
export function configCode(): string {
  return `CFG-${randomCode(5)}`;
}

export function cartToken(): string {
  return crypto.randomUUID();
}

export function parseSpecs(
  json: string,
): Array<{ label: string; labelAr: string; value: string; valueAr: string }> {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
