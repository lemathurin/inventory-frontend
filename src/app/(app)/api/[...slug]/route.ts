import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  return handleRequest(request, params, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  return handleRequest(request, params, "POST");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  return handleRequest(request, params, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  return handleRequest(request, params, "DELETE");
}

async function handleRequest(
  request: NextRequest,
  params: { slug: string[] },
  method: string,
) {
  if (process.env.CI !== "true") {
    return NextResponse.json(
      { error: "API not available in dev mode" },
      { status: 404 },
    );
  }

  const path = params.slug.join("/");
  const body = method !== "GET" ? await request.json() : null;

  if (method === "POST" && path === "auth/register") {
    return NextResponse.json(
      { id: `user_${Date.now()}`, ...body },
      { status: 201 },
    );
  }

  if (method === "POST" && path === "auth/login") {
    return NextResponse.json({ token: "fake-token" }, { status: 200 });
  }

  if (method === "POST" && path === "homes") {
    return NextResponse.json(
      { id: `home_${Date.now()}`, ...body },
      { status: 201 },
    );
  }

  if (
    method === "POST" &&
    path.includes("invites") &&
    !path.includes("accept")
  ) {
    return NextResponse.json({ invite: { code: "FAKE123" } }, { status: 201 });
  }

  if (method === "POST" && path === "homes/invites/accept") {
    return NextResponse.json({ home: { id: "home_123" } }, { status: 200 });
  }

  if (method === "GET" && path.includes("items/home/")) {
    return NextResponse.json([], { status: 200 });
  }

  if (method === "POST" && path.includes("item")) {
    return NextResponse.json(
      { id: `item_${Date.now()}`, ...body },
      { status: 201 },
    );
  }

  if (method === "POST" && path === "auth/logout") {
    return NextResponse.json({ message: "Logged out" }, { status: 200 });
  }

  if ((method === "PATCH" || method === "DELETE") && path.includes("items/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Fallback
  return NextResponse.json({ message: "Mock response" }, { status: 200 });
}
