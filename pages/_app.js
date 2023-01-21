import '../styles/globals.css'
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

  return (
    <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
    <Component {...pageProps} />
    </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
