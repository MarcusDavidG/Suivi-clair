import { Chain } from 'wagmi'

export const liskSepolia = {
  id: 4202,
  name: 'Lisk Sepolia',
  network: 'lisk-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
    public: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Lisk Explorer', 
      url: 'https://sepolia-blockscout.lisk.com' 
    },
  },
  testnet: true,
} as const satisfies Chain

export const SUPPORTED_CHAINS = [liskSepolia]
