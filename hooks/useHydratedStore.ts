import { useEffect, useState } from "react";

export function useHydratedStore<T>(selector: (state: any) => T, store: any) {
  const [hydrated, setHydrated] = useState(false);
  const data = store(selector);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated ? data : undefined;
}
