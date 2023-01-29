import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import Layout from "../components/layout";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useRouter } from "next/router";
import { MetaMaskProvider } from "metamask-react";
import Meta from "../components/Meta";
import UserContext from "../components/UserContext";
import { useEffect, useRef } from "react";

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';  
import {
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, optimism, bscTestnet, goerli } from 'wagmi/chains'

function MyApp({ Component, pageProps }) {
  const { chains, provider } = configureChains(
    [goerli, bscTestnet],
    [
      alchemyProvider({ apiKey: 'br-vL2X5K6ZxKDZ8N_U9sEnkIkba9Zw6' }), publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })
  //End of TKN

  const router = useRouter();
  const pid = router.asPath;
  const scrollRef = useRef({
    scrollPos: 0,
  });

  useEffect(() => {
    // if (pid === '/home/home_8') {
    // 	const html = document.querySelector('html');
    // 	html.classList.remove('light');
    // 	html.classList.add('dark');
    // }
  }, []);

  return (
    <>
      <Meta title="Home 1 || Xhibiter | NFT Marketplace Next.js Template" />

      <Provider store={store}>
        <ThemeProvider enableSystem={true} attribute="class">
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <MetaMaskProvider>
                <UserContext.Provider value={{ scrollRef: scrollRef }}>
                  {pid === "/login" ? (
                    <Component {...pageProps} />
                  ) : (
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  )}
                </UserContext.Provider>
              </MetaMaskProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
