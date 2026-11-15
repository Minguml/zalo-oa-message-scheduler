"use client";

import { buttonStyle, type Palette } from "../../_shared/theme";
import type { ManagedGroup } from "./types";

type Props = {
  t: Palette;
  groups: ManagedGroup[];
  loading: boolean;
  error: string;
  onReload: () => void;
};

export default function ManagedGroups({ t, groups, loading, error, onReload }: Props) {
  const enabledCount = groups.filter((g) => g.status === "enabled").length;

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <p style={{ color: t.muted, margin: 0 }}>
          {groups.length} group(s), {enabledCount} enabled
        </p>
        <button type="button" onClick={onReload} disabled={loading} style={buttonStyle(t)}>
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error && <p style={{ color: "#dc2626", margin: 0 }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
        {groups.map((g) => (
          <li
            key={g.groupId}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: 12,
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: 6,
            }}
          >
            {g.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={g.avatar}
                alt=""
                width={48}
                height={48}
                referrerPolicy="no-referrer"
                style={{ borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: 8, background: t.inputBg, flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>{g.name || "(no name)"}</div>
              <div style={{ color: t.muted, fontFamily: "monospace", fontSize: 12, overflowWrap: "anywhere" }}>
                {g.groupId}
              </div>
              <div style={{ color: t.muted, fontSize: 12 }}>
                {g.totalMember} members · {g.status}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
