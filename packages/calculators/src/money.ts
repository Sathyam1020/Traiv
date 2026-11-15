/**
 * Currency for the business calculators.
 *
 * Switching currency changes the symbol and the number format, never the number. Every
 * money input in these tools is the coach's own figure, so converting it at an exchange
 * rate would only mean fetching a rate from somewhere that can be wrong today.
 */

export const CURRENCIES = ["EUR", "USD", "GBP", "INR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "EUR";

const LOCALE: Record<Currency, string> = {
  EUR: "en-IE",
  USD: "en-US",
  GBP: "en-GB",
  INR: "en-IN",
};

export const CURRENCY_LABEL: Record<Currency, string> = {
  EUR: "EUR (€)",
  USD: "USD ($)",
  GBP: "GBP (£)",
  INR: "INR (₹)",
};

export function isCurrency(value: string): value is Currency {
  return (CURRENCIES as readonly string[]).includes(value);
}

/** Whole units by default; pass `fractionDigits` for prices such as a per-lead cost. */
export function formatMoney(amount: number, currency: Currency, fractionDigits = 0): string {
  return new Intl.NumberFormat(LOCALE[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(Number.isFinite(amount) ? amount : 0);
}
