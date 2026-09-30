"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

// Loads data from the API for a component.
//   const { data, error, loading, reload } = useApi("/orders/my?page=1")
// Pass null as the path to skip loading.
export function useApi(path) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const key = path ? `${path}#${version}` : null;

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    api(path)
      .then((data) => !cancelled && setResult({ key, data, error: null }))
      .catch((error) => !cancelled && setResult({ key, data: null, error }));
    return () => {
      cancelled = true;
    };
  }, [path, key]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const loading = Boolean(key) && result.key !== key;

  return {
    // Keep showing the previous data while reloading (no flicker)
    data: result.data,
    error: loading ? null : result.error,
    loading,
    reload,
  };
}
