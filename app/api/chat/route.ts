import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  return NextResponse.json({
    reply: `✅ API is working. You said: ${body?.messages?.at(-1)?.content ?? ""}`,
  });
}

