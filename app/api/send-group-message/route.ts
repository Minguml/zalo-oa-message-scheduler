import { NextRequest, NextResponse } from "next/server";

const ZALO_GROUP_MESSAGE_URL = "https://openapi.zalo.me/v3.0/oa/group/message";

type SendBody = {
  accessToken?: unknown;
  groupId?: unknown;
  text?: unknown;
};

export async function POST(req: NextRequest) {
  let body: SendBody;
  try {
    body = (await req.json()) as SendBody;
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  // Token from the form wins; fall back to the .env value if the field is empty.
  const formToken = typeof body.accessToken === "string" ? body.accessToken.trim() : "";
  const accessToken = formToken || process.env.ZALO_OA_ACCESS_TOKEN || "";
  if (!accessToken) {
    return NextResponse.json(
      { error: "No access token. Enter one in the form or set ZALO_OA_ACCESS_TOKEN in .env.local." },
      { status: 400 }
    );
  }

  const groupId = typeof body.groupId === "string" ? body.groupId.trim() : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!groupId || !text) {
    return NextResponse.json({ error: "Both groupId and text are required." }, { status: 400 });
  }

  // Same request as the original curl: access_token header + JSON body.
  const zaloResponse = await fetch(ZALO_GROUP_MESSAGE_URL, {
    method: "POST",
    headers: {
      access_token: accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: { group_id: groupId },
      message: { text },
    }),
    cache: "no-store",
  });

  const data: unknown = await zaloResponse.json().catch(() => ({
    error: "Zalo returned a non-JSON response",
    status: zaloResponse.status,
  }));

  return NextResponse.json(data, { status: zaloResponse.ok ? 200 : zaloResponse.status });
}
