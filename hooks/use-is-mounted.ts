import { useState, useEffect } from "react";

/**
 * Hook to track if code is running on the client side
 * @returns True if running on client
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
