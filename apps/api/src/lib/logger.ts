/**
 * One JSON object per line, to stdout. Not a dependency — a leveled logger that just
 * shapes a line consistently is the "pulled in for one function" case
 * `.ai/engineering/dependencies.md` says to reject, not install.
 *
 * Every field after the message is free-form context (route, status, duration, error),
 * kept as a flat object so any log shipper can parse it without a schema.
 */
type Level = "info" | "warn" | "error";

function emit(level: Level, message: string, fields?: Record<string, unknown>) {
  const line = JSON.stringify({
    level,
    message,
    time: new Date().toISOString(),
    ...fields,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (message: string, fields?: Record<string, unknown>) => emit("info", message, fields),
  warn: (message: string, fields?: Record<string, unknown>) => emit("warn", message, fields),
  error: (message: string, fields?: Record<string, unknown>) => emit("error", message, fields),
};
