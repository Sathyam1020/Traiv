import {
  type CountryCode,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js/mobile";
import examples from "libphonenumber-js/mobile/examples";

/**
 * One definition of what a phone number is, shared by the API and every app.
 *
 * It used to be `/^[6-9]\d{9}$/` written out in nine places — four sign-in forms, the
 * route schema, the service, the shared field, and a migration. Nine copies of a rule is
 * nine chances for the form to accept what the server refuses, and every one of them
 * also assumed India forever.
 *
 * The `/mobile` metadata is deliberate over the smaller `/min`: it knows the difference
 * between a mobile and a landline, and a landline cannot receive an SMS or a WhatsApp
 * message. Accepting one would create an account that can never be signed into again.
 */

export type { CountryCode };

export type Country = {
  code: CountryCode;
  /** Localised, from the platform — not a list we have to maintain and translate. */
  name: string;
  /** Without the plus, e.g. "91". */
  dial: string;
  flag: string;
  /** A real mobile number, formatted the way that country writes it. */
  example: string;
  /** The same number as bare digits — what somebody would actually type. */
  examplePlain: string;
};

/** The market we serve first, and the default in every picker. */
export const DEFAULT_COUNTRY: CountryCode = "IN";

/** Regional indicator symbols, so there is no flag image set to ship or keep current. */
function flagOf(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

const displayNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function nameOf(code: CountryCode): string {
  try {
    return displayNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

function exampleOf(code: CountryCode): { example: string; examplePlain: string } {
  try {
    const n = getExampleNumber(code, examples);
    return { example: n?.formatNational() ?? "", examplePlain: n?.nationalNumber ?? "" };
  } catch {
    return { example: "", examplePlain: "" };
  }
}

/**
 * Every country the metadata knows, with the default pinned first and the rest
 * alphabetical. Built once — it is the same on every render.
 */
export const COUNTRIES: readonly Country[] = (() => {
  const all = getCountries()
    .map((code) => ({
      code,
      name: nameOf(code),
      dial: getCountryCallingCode(code),
      flag: flagOf(code),
      ...exampleOf(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const first = all.filter((c) => c.code === DEFAULT_COUNTRY);
  return [...first, ...all.filter((c) => c.code !== DEFAULT_COUNTRY)];
})();

const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

export function country(code: CountryCode): Country {
  return BY_CODE.get(code) ?? (COUNTRIES[0] as Country);
}

export type PhoneProblem = "empty" | "too_short" | "too_long" | "not_mobile" | "invalid";

export type PhoneResult =
  | { ok: true; e164: string; country: CountryCode }
  | { ok: false; problem: PhoneProblem };

/**
 * Parse what somebody typed into something storable.
 *
 * Accepts a national number ("98765 43210"), an international one ("+91 98765 43210"),
 * and the spacing and punctuation people actually use. The country is a hint for the
 * national form only — a number that carries its own country code keeps it, so pasting a
 * full international number into a field set to the wrong country still works.
 */
export function parsePhone(input: string, forCountry: CountryCode = DEFAULT_COUNTRY): PhoneResult {
  const trimmed = input.trim();
  if (!trimmed || !/\d/.test(trimmed)) return { ok: false, problem: "empty" };

  try {
    const parsed = parsePhoneNumberWithError(trimmed, { defaultCountry: forCountry });

    if (!parsed.isValid()) return { ok: false, problem: "invalid" };

    // A landline cannot receive the code we are about to send it.
    const type = parsed.getType();
    if (type && type !== "MOBILE" && type !== "FIXED_LINE_OR_MOBILE") {
      return { ok: false, problem: "not_mobile" };
    }

    return {
      ok: true,
      e164: parsed.number,
      country: (parsed.country ?? forCountry) as CountryCode,
    };
  } catch (err) {
    const code = (err as { message?: string }).message;
    if (code === "TOO_SHORT") return { ok: false, problem: "too_short" };
    if (code === "TOO_LONG") return { ok: false, problem: "too_long" };
    return { ok: false, problem: "invalid" };
  }
}

export function isValidMobile(input: string, forCountry: CountryCode = DEFAULT_COUNTRY): boolean {
  return parsePhone(input, forCountry).ok;
}

/**
 * What to tell the person, in their country's terms rather than ours.
 *
 * Never names a specific country's rules — "Indian mobile numbers start with 6, 7, 8 or
 * 9" is useless the moment somebody is not Indian, and there are roughly two hundred
 * other sets of rules nobody wants to hardcode. The example number does the explaining.
 */
export function phoneProblemMessage(problem: PhoneProblem, forCountry: CountryCode): string {
  const c = country(forCountry);
  const example = c.example ? ` Example: ${c.example}` : "";

  switch (problem) {
    case "empty":
      return "Enter your phone number.";
    case "too_short":
      return `That's too short for a number in ${c.name}.${example}`;
    case "too_long":
      return `That's too long for a number in ${c.name}.${example}`;
    case "not_mobile":
      return "That looks like a landline. Enter a mobile number — we send a code by text.";
    default:
      return `That doesn't look like a mobile number in ${c.name}.${example}`;
  }
}
