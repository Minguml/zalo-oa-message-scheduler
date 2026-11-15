"use client";

import { useState, type FormEvent } from "react";
import { buttonStyle, fieldStyle, type Palette } from "../../_shared/theme";
import type { ManagedGroup } from "../groups/types";

type Props = {
  t: Palette;
  defaultAccessToken: string;
  groups: ManagedGroup[];
  groupsLoading: boolean;
  groupsError: string;
  onReloadGroups: () => void;
};

export default function SendForm({
  t,
  defaultAccessToken,
  groups,
  groupsLoading,
  groupsError,
  onReloadGroups,
}: Props) {
  const [accessToken, setAccessToken] = useState(defaultAccessToken);
  const [showToken, setShowToken] = useState(false);
  const [groupId, setGroupId] = useState("65987a60510eb850e11f");
  const [text, setText] = useState("hello from api");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const enabledGroups = groups.filter((g) => g.status === "enabled");
  const selectedGroupId = enabledGroups.some((g) => g.groupId === groupId)
    ? groupId
    : enabledGroups[0]?.groupId ?? "";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/send-group-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, groupId: selectedGroupId, text }),
      });
      const data = await res.json();
      setOutput(JSON.stringify(data, null, 2));
    } catch (err) {
      setOutput(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 4 }}>
          Access token
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type={showToken ? "text" : "password"}
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Leave as default to use ZALO_OA_ACCESS_TOKEN from .env.local"
              autoComplete="off"
              style={{ ...fieldStyle(t), fontFamily: "monospace", flex: 1 }}
            />
            <button type="button" onClick={() => setShowToken((s) => !s)} style={buttonStyle(t)}>
              {showToken ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <label style={{ display: "grid", gap: 4 }}>
          Group
          <div style={{ display: "flex", gap: 8 }}>
            <select
              value={selectedGroupId}
              onChange={(e) => setGroupId(e.target.value)}
              required
              disabled={enabledGroups.length === 0}
              style={{ ...fieldStyle(t), flex: 1 }}
            >
              {enabledGroups.length === 0 && (
                <option value="">{groupsLoading ? "Loading groups…" : "No enabled groups"}</option>
              )}
              {enabledGroups.map((g) => (
                <option key={g.groupId} value={g.groupId}>
                  {g.name || "(no name)"} ({g.groupId})
                </option>
              ))}
            </select>
            <button type="button" onClick={onReloadGroups} disabled={groupsLoading} style={buttonStyle(t)}>
              {groupsLoading ? "…" : "Refresh"}
            </button>
          </div>
          {groupsError && <span style={{ color: "#dc2626", fontSize: 12 }}>{groupsError}</span>}
        </label>

        <label style={{ display: "grid", gap: 4 }}>
          Message text
          <textarea value={text} onChange={(e) => setText(e.target.value)} required rows={4} style={fieldStyle(t)} />
        </label>

        <button
          type="submit"
          disabled={loading || enabledGroups.length === 0}
          style={{ ...buttonStyle(t), padding: "10px 16px", justifySelf: "start", cursor: loading ? "wait" : "pointer" }}
        >
          {loading ? "Sending…" : "Send group message"}
        </button>
      </form>

      {output && (
        <pre
          style={{
            marginTop: 24,
            padding: 12,
            background: t.surface,
            color: t.text,
            border: `1px solid ${t.border}`,
            borderRadius: 6,
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {output}
        </pre>
      )}
    </div>
  );
}
