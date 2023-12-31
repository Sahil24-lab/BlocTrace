import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { AppStateProvider } from "../hooks/useAppState";

import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  DisclaimerComponent,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";

import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { createConfig, configureChains, WagmiConfig } from "wagmi";
import { avalanche, avalancheFuji } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { SessionProvider } from "next-auth/react";

//import MainLayout from "../layout/mainLayout";
import { useRouter } from "next/router";

import myTheme from "../theme/theme";

// FONT FOR WEB APP & CHAKRA UI
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../styles/globals.css";

import { Session } from "next-auth";

const walletConnectProjectId: string | undefined =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const infuraApiKey: string | undefined = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [avalancheFuji, avalanche],
  [infuraProvider({ apiKey: infuraApiKey! }), publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ projectId: walletConnectProjectId!, chains }),
      walletConnectWallet({ projectId: walletConnectProjectId!, chains }),
      metaMaskWallet({
        projectId: walletConnectProjectId!,
        chains,
        shimDisconnect: true,
      }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  const router = useRouter();

  return (
    <ChakraProvider theme={myTheme}>
      <WagmiConfig config={wagmiConfig}>
        <SessionProvider refetchInterval={0} session={pageProps.session}>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#D66E36",
              accentColorForeground: "white",
              borderRadius: "medium",
              fontStack: "system",
            })}
            modalSize="wide"
            initialChain={parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN!)}
            chains={chains}
          >
            <AppStateProvider>
              <Component {...pageProps} />
            </AppStateProvider>
          </RainbowKitProvider>
        </SessionProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
{
  /* <MainLayout>
<Component {...pageProps} />
</MainLayout> */
}
