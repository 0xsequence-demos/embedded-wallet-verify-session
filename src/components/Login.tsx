import { useCallback, Dispatch, SetStateAction } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

export default function App(props: {
  wallet: string;
  setCredential: Dispatch<SetStateAction<string>>;
}) {
  const { wallet, setCredential } = props;

  const handleGoogleLogin = useCallback(
    (tokenResponse: CredentialResponse) => {
      setCredential(tokenResponse.credential || "");
    },
    [setCredential],
  );

  console.log("rerender", wallet);

  return (
    <>
      <span className="sign-in-via">SIGN IN VIA</span>
      <br />
      <br />
      <br />
      <div className="login-container">
        <div className="dashed-box-google">
          <div
            className="gmail-login"
            style={{
              overflow: "hidden",
              opacity: "0",
              width: "180px",
              position: "absolute",
              zIndex: 1,
              height: "100px",
            }}
          >
            <GoogleLogin onSuccess={handleGoogleLogin} shape="circle" />
          </div>
          Gmail
        </div>
      </div>
    </>
  );
}
