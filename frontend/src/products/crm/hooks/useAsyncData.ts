import { useCallback, useEffect, useState } from "react";
import { errMsg } from "@/shared/api/client";

export const useAsyncData = <T,>(loader: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    setLoading(true);
    try { setData(await loader()); setError(""); } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  }, [loader]);
  useEffect(() => { reload(); }, [reload]);
  return { data, error, loading, reload, setData };
};
