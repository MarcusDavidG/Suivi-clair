export const WALLET_CONNECT_PROJECT_ID = 'c9424654f7514d8f8e3a25d5d0bb7c60' // This is a test project ID, replace with your own from WalletConnect Cloud

export const SUPPORTED_CHAINS = [
  {
    id: 11155111, // Sepolia testnet
    name: 'Sepolia',
    network: 'sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.sepolia.org'],
      },
      public: {
        http: ['https://rpc.sepolia.org'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Sepolia Etherscan',
        url: 'https://sepolia.etherscan.io',
      },
    },
    testnet: true,
  },
]
