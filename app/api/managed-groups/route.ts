import { NextResponse } from "next/server";

const GROUPS_OF_OA_URL = "https://openapi.zalo.me/v3.0/oa/group/getgroupsofoa";
const PAGE_SIZE = 20;
const MAX_PAGES = 50; // safety cap: 1,000 groups

type ZaloGroup = {
  name?: string;
  avatar?: string;
  group_id?: string;
  total_member?: number;
  status?: string;
};

type ZaloGroupsPage = {
  error?: number;
  message?: string;
  data?: { total?: number; groups?: ZaloGroup[] };
};

export async function GET() {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: "ZALO_OA_ACCESS_TOKEN is not set on the server." }, { status: 500 });
  }

  const collected: ZaloGroup[] = [];
  let offset = 0;

  for (let page = 0; page < MAX_PAGES; page++) {
    const res = await fetch(`${GROUPS_OF_OA_URL}?offset=${offset}&count=${PAGE_SIZE}`, {
      headers: { access_token: accessToken },
      cache: "no-store",
    });
    const json = (await res.json().catch(() => null)) as ZaloGroupsPage | null;

    if (!res.ok || !json || json.error !== 0) {
      return NextResponse.json(
        { error: json?.message ?? `Zalo request failed (${res.status})` },
        { status: res.ok ? 502 : res.status }
      );
    }

    const batch = json.data?.groups ?? [];
    collected.push(...batch);
    offset += batch.length;

    const total = json.data?.total ?? 0;
    if (batch.length === 0 || offset >= total) break;
  }

  const groups = collected
    .filter((g): g is ZaloGroup & { group_id: string } => typeof g.group_id === "string")
    .map((g) => ({
      groupId: g.group_id,
      name: g.name ?? "",
      avatar: g.avatar ?? "",
      totalMember: g.total_member ?? 0,
      status: g.status ?? "unknown",
    }));

  return NextResponse.json({ groups });
}
