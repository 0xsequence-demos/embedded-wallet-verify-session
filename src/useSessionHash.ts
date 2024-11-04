import sequence from "./SequenceEmbeddedWallet.ts";
import { useEffect, useState } from "react";

export function useSessionHash() {
  const [sessionHash, setSessionHash] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<any>(undefined);

  useEffect(() => {
    const handler = async () => {
      try {
        setSessionHash(await sequence.getSessionHash());
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };
    handler();
    return sequence.onSessionStateChanged(handler);
  }, [setSessionHash, setError]);

  return {
    sessionHash,
    error,
    loading: !!sessionHash,
  };
}
