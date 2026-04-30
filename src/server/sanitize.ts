import sanitizeHtml from "sanitize-html";
import type { NextRequest } from "next/server";

const sanitizeObject = (value: unknown): unknown => {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeObject(entry));
  }

  const record = value as Record<string, unknown>;

  for (const key of Object.keys(record)) {
    const current = record[key];
    if (typeof current === "string") {
      record[key] = sanitizeHtml(current);
    } else {
      record[key] = sanitizeObject(current);
    }
  }

  return record;
};

export const getSanitizedBody = async <T>(request: NextRequest): Promise<T> => {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return {} as T;
  }

  const body = (await request.json()) as T;
  return sanitizeObject(body) as T;
};
