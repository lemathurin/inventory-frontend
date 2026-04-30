import { NextResponse } from "next/server";

export const json = <T>(body: T, init?: ResponseInit) =>
  NextResponse.json(body, init);

export const serverError = (error: unknown, message: string) => {
  console.error(message, error);

  return json(
    {
      error: message,
      details: error instanceof Error ? error.message : "Unknown error",
    },
    { status: 500 },
  );
};
