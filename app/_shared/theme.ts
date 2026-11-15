import type { CSSProperties } from "react";

export type Theme = "light" | "dark";

export type Palette = {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  inputBg: string;
  buttonBg: string;
};

export const palettes: Record<Theme, Palette> = {
  light: {
    bg: "#f5f6f8",
    surface: "#ffffff",
    text: "#111827",
    muted: "#555555",
    border: "#d1d5db",
    inputBg: "#ffffff",
    buttonBg: "#ffffff",
  },
  dark: {
    bg: "#0f1115",
    surface: "#1a1d24",
    text: "#e5e7eb",
    muted: "#9ca3af",
    border: "#374151",
    inputBg: "#111418",
    buttonBg: "#1f2430",
  },
};

export const THEME_KEY = "zalo-oa-theme";

export function buttonStyle(t: Palette): CSSProperties {
  return {
    padding: "6px 12px",
    background: t.buttonBg,
    color: t.text,
    border: `1px solid ${t.border}`,
    borderRadius: 4,
    cursor: "pointer",
  };
}

export function fieldStyle(t: Palette): CSSProperties {
  return {
    padding: 8,
    background: t.inputBg,
    color: t.text,
    border: `1px solid ${t.border}`,
    borderRadius: 4,
  };
}
