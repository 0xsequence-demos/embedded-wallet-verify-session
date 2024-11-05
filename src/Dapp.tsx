import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useSessionHash } from "./useSessionHash";

import "@0xsequence/design-system/styles.css";
import { useCallback, useEffect, useState } from "react";
import sequence from "./sequence.ts";
import { SignInResponse } from "@0xsequence/waas";
export function Dapp() {
  const { sessionHash } = useSessionHash();
  const [wallet, setWallet] = useState("");
  const [credential, setCredential] = useState("");

  const onSignInResponse = useCallback(
    (res: SignInResponse) => {
      console.log(res.wallet);
      setWallet(res.wallet);
    },
    [setWallet],
  );

  useEffect(() => {
    if (!credential) {
      return;
    }
    sequence
      .signIn(
        {
          idToken: credential,
        },
        "template",
      )
      .then(onSignInResponse);
  }, [credential, onSignInResponse]);

  useEffect(() => {
    sequence.isSignedIn().then(async (loggedIn) => {
      if (loggedIn) {
        setWallet(await sequence.getAddress());
      }
    });
  }, [setWallet]);

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      nonce={sessionHash}
      key={sessionHash}
    >
      <App
        wallet={wallet}
        setWallet={setWallet}
        setCredential={setCredential}
      />
      ;
    </GoogleOAuthProvider>
  );
}
