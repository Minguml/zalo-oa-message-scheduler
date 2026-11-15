"use client";

import { useCallback, useEffect, useState } from "react";
import type { ManagedGroup } from "./types";

async function fetchManagedGroups(): Promise<ManagedGroup[]> {
  const res = await fetch("/api/managed-groups", { cache: "no-store" });
  const data = (await res.json()) as { error?: string; groups?: ManagedGroup[] };
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }
  return data.groups ?? [];
}

export function useManagedGroups() {
  const [groups, setGroups] = useState<ManagedGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setGroups(await fetchManagedGroups());
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchManagedGroups()
      .then((loadedGroups) => {
        if (!cancelled) setGroups(loadedGroups);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { groups, loading, error, reload };
}
