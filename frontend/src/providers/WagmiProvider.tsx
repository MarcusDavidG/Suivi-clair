import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { WALLET_CONNECT_PROJECT_ID } from '../config/wallet'
import { SUPPORTED_CHAINS } from '../config/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  SUPPORTED_CHAINS,
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
      }),
    }),
    publicProvider()
  ]
)

const connectors = [
  new MetaMaskConnector({ 
    chains,
    options: {
      shimDisconnect: true,
      UNSTABLE_shimOnConnectSelectAccount: true,
    }
  }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'BlockRoute',
      reloadOnDisconnect: true,
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: WALLET_CONNECT_PROJECT_ID,
      metadata: {
        name: 'BlockRoute',
        description: 'Blockchain-based Supply Chain Management',
        url: window.location.origin,
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    },
  }),
]

const config = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  )
}
