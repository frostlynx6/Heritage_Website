import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /.+@.+\..+/.test(email);
}

export async function POST(req: Request) {
  try {
    const { name = "", email = "", message = "" } = await req.json().catch(() => ({}));

    const trimmedName = String(name).trim().slice(0, 100);
    const trimmedEmail = String(email).trim().slice(0, 200);
    const trimmedMsg = String(message).trim().slice(0, 500);

    if (!trimmedName || !trimmedEmail || !trimmedMsg) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Preferred: server-only secret; Fallback: public var (exposes webhook to clients)
    const webhook = process.env.DISCORD_WEBHOOK_URL || process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;
    if (!webhook) {
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const content = [
      `📬 New feedback received`,
      `• Name: ${trimmedName}`,
      `• Email: ${trimmedEmail}`,
      "",
      "```",
      trimmedMsg,
      "```",
    ].join("\n");

    const resp = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return NextResponse.json({ error: `Failed to post to Discord: ${text}` }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
