import App from "./App.tsx";
import "./index.css";
import { useSessionHash } from "./useSessionHash.ts";

import { GoogleOAuthProvider } from "@react-oauth/google";
import "@0xsequence/design-system/styles.css";
export function Dapp() {
  const { sessionHash } = useSessionHash();

  return (
    <GoogleOAuthProvider
      clientId={
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        "970987756660-35a6tc48hvi8cev9cnknp0iugv9poa23.apps.googleusercontent.com"
      }
      nonce={sessionHash}
      key={sessionHash}
    >
      <App />
    </GoogleOAuthProvider>
  );
}
