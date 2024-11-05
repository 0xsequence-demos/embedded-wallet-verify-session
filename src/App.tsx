import { Dispatch, SetStateAction } from "react";
import "./App.css";
import CenteredLogo from "./components/CenteredLogo";
import VerifyWallet from "./components/VerifyWallet";
import Login from "./components/Login";

export default function App(props: {
  wallet: string;
  setWallet: Dispatch<SetStateAction<string>>;
  setCredential: Dispatch<SetStateAction<string>>;
}) {
  const { wallet, setCredential, setWallet } = props;

  return (
    <>
      <CenteredLogo />
      <br />
      <br />
      {!wallet ? (
        <Login wallet={wallet} setCredential={setCredential} />
      ) : (
        <VerifyWallet wallet={wallet} setWallet={setWallet} />
      )}
    </>
  );
}
