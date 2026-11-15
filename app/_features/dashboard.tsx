"use client";

import { useState, useSyncExternalStore } from "react";
import SendForm from "./send-message/send-form";
import ManagedGroups from "./groups/managed-groups";
import { useManagedGroups } from "./groups/use-managed-groups";
import { buttonStyle, palettes, THEME_KEY, type Theme } from "../_shared/theme";

type Tab = "send" | "groups";

const THEME_CHANGE_EVENT = "zalo-oa-theme-change";

function subscribeToTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

function getThemeSnapshot(): Theme {
  const saved = window.localStorage.getItem(THEME_KEY);
  return saved === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

export default function Dashboard({ defaultAccessToken }: { defaultAccessToken: string }) {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [tab, setTab] = useState<Tab>("send");
  const { groups, loading, error, reload } = useManagedGroups();

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    window.localStorage.setItem(THEME_KEY, next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  const t = palettes[theme];

  function tabButton(value: Tab, label: string) {
    const active = tab === value;
    return (
      <button
        type="button"
        onClick={() => setTab(value)}
        style={{
          ...buttonStyle(t),
          fontWeight: active ? 700 : 400,
          borderBottom: active ? `2px solid ${t.text}` : `1px solid ${t.border}`,
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text }}>
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "32px 16px", fontFamily: "system-ui, sans-serif" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <h1 style={{ margin: 0 }}>Zalo OA</h1>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            style={{ ...buttonStyle(t), whiteSpace: "nowrap" }}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </header>

        <nav style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {tabButton("send", "Send message")}
          {tabButton("groups", "Managed groups")}
        </nav>

        <div style={{ marginTop: 16 }}>
          {tab === "send" ? (
            <SendForm
              t={t}
              defaultAccessToken={defaultAccessToken}
              groups={groups}
              groupsLoading={loading}
              groupsError={error}
              onReloadGroups={reload}
            />
          ) : (
            <ManagedGroups t={t} groups={groups} loading={loading} error={error} onReload={reload} />
          )}
        </div>
      </main>
    </div>
  );
}
