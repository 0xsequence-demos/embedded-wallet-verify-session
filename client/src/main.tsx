import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useSessionHash } from "./useSessionHash.ts";

import { GoogleOAuthProvider } from '@react-oauth/google'
import {ThemeProvider} from '@0xsequence/design-system'
import "@0xsequence/design-system/styles.css"
function Dapp() {
  const { sessionHash } = useSessionHash()

  return (
		<GoogleOAuthProvider clientId="908369456253-9ki3cl7bauhhu61hgtb66c1ioo0u2n24.apps.googleusercontent.com" nonce={sessionHash} key={sessionHash}>
			<App />
		</GoogleOAuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Dapp />
    </ThemeProvider>
  </React.StrictMode>
)
