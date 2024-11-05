import sequenceLogo from "../assets/sequence-icon.svg";
export default function CenteredLogo() {
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
