import { Dispatch, SetStateAction, useCallback, useState } from "react";
import sequence from "../sequence";
import { Button, Card } from "@0xsequence/design-system";

interface WalletInfo {
  walletAddress: string;
  email: string;
  iat: number;
  exp: number;
}

export default function VerifyWallet(props: {
  wallet: string;
  setWallet: Dispatch<SetStateAction<string>>;
}) {
  const { wallet, setWallet } = props;
  const [verificationResult, setVerificationResult] =
    useState<WalletInfo | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const verifyWalletBackend = useCallback(async () => {
    try {
      const { idToken } = await sequence.getIdToken();

      const response = await fetch("api/verify-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sequenceToken: idToken }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setVerificationResult(data.wallet);
        setError(null);
      } else {
        setError(data.error || "Verification failed");
        setVerificationResult(null);
      }
    } catch (e) {
      console.error(e);
      setError("An error occurred during verification");
      setVerificationResult(null);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (loggingOut) {
      return;
    }
    setLoggingOut(true);
    try {
      const sessions = await sequence.listSessions();

      for (let i = 0; i < sessions.length; i++) {
        await sequence.dropSession({ sessionId: sessions[i].id });
      }
      setWallet("");
    } catch (err) {
      console.log(err);
    }
    setLoggingOut(false);
  }, [loggingOut, setLoggingOut, setWallet]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "30px",
          right: "30px",
          opacity: loggingOut ? "50%" : "100%",
        }}
      >
        <h5
          style={{ cursor: "pointer", margin: 0, marginRight: 50 }}
          onClick={signOut}
        >
          Sign Out
        </h5>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw", // Full viewport width
        }}
      >
        <h5>Send a post request to local backend that verifies JWT.</h5>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px", // Space of 10px between items
          }}
        >
          <Card>
            <span>{wallet.slice(0, 10) + "..." + wallet.slice(-5)}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              label="Verify Wallet on Backend 🔗"
              onClick={verifyWalletBackend}
            />
          </Card>

          {error && (
            <Card style={{ backgroundColor: "#ffebee", color: "#c62828" }}>
              <p>Error: {error}</p>
            </Card>
          )}

          {verificationResult && (
            <Card style={{ backgroundColor: "#e8f5e9", color: "#2e7d32" }}>
              <h4>Verification Successful!</h4>
              <p>Wallet Address: {verificationResult.walletAddress}</p>
              <p>Email: {verificationResult.email}</p>
              <p>
                Issued At:{" "}
                {new Date(verificationResult.iat * 1000).toLocaleString()}
              </p>
              <p>
                Expires At:{" "}
                {new Date(verificationResult.exp * 1000).toLocaleString()}
              </p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
