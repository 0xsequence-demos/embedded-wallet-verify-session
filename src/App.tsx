import { useState, useEffect } from "react";
import "./App.css";
import sequence from "./SequenceEmbeddedWallet";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import sequenceLogo from "./assets/sequence-icon.svg";
import { Button, Card } from "@0xsequence/design-system";
function CenteredLogo() {
  const containerStyle = {
    display: "grid",
    placeItems: "center",
    width: "97.5vw", // Full viewport width
  };

  return (
    <div style={containerStyle}>
      <img src={sequenceLogo} width={150} alt="Sequence Logo" />
    </div>
  );
}

interface WalletInfo {
  walletAddress: string;
  email: string;
  iat: number;
  exp: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function VerifyWallet({ wallet }: any) {
  const [verificationResult, setVerificationResult] =
    useState<WalletInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const verifyWalletBackend = async () => {
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
  };
  return (
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
            onClick={() => verifyWalletBackend()}
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
  );
}

function LoginScreen() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [wallet, setWallet] = useState<any>(null);

  const handleGoogleLogin = async (tokenResponse: CredentialResponse) => {
    const res = await sequence.signIn(
      {
        idToken: tokenResponse.credential!, // inputted id credential from google
      },
      "template",
    );
    setWallet(res.wallet);
  };

  useEffect(() => {
    setTimeout(async () => {
      if (await sequence.isSignedIn()) {
        setWallet(await sequence.getAddress());
      }
    }, 0);
  }, []);

  useEffect(() => {}, [wallet]);

  const signOut = async () => {
    try {
      const sessions = await sequence.listSessions();

      for (let i = 0; i < sessions.length; i++) {
        await sequence.dropSession({ sessionId: sessions[i].id });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {<CenteredLogo />}
      <br />
      <br />
      {!wallet ? (
        <>
          <span className="sign-in-via">SIGN IN VIA</span>
          <br />
          <br />
          <br />
          <div className="login-container">
            <div className="dashed-box-google">
              <p className="content">
                <div
                  className="gmail-login"
                  style={{
                    overflow: "hidden",
                    opacity: "0",
                    width: "90px",
                    position: "absolute",
                    zIndex: 1,
                    height: "100px",
                  }}
                >
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    shape="circle"
                    width={230}
                  />
                </div>
                <span className="gmail-login">Gmail</span>
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ position: "fixed", top: "30px", right: "30px" }}>
            <h5
              style={{ cursor: "pointer", margin: 0 }}
              onClick={() => signOut()}
            >
              Sign Out
            </h5>
          </div>
          <VerifyWallet wallet={wallet} />
        </>
      )}
    </>
  );
}

function App() {
  return <LoginScreen />;
}

export default App;
