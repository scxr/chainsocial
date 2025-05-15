import { Chain } from "viem";

export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string;


if (!PRIVY_APP_ID) {
  throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not set in environment variables');
}

const monadChain: Chain = {
  id: 1998991,
  name: 'XPhere',
  rpcUrls: {
    default: {
      http: ['https://testnet.x-phere.com'],
    },
  },
  nativeCurrency: {
    name: 'XPhere',
    symbol: 'XPHERE',
    decimals: 18,
  },
  
}

export const privyConfig = {
  loginMethods: ['email'] as ['email'],
  appearance: {
    theme: 'dark' as const,
    accentColor: '#2A0134' as `#${string}`,
    showWalletLoginFirst: false,
  },
  defaultChain: monadChain,
  supportedChains: [
    monadChain
  ],
  createPrivyWalletOnLogin: true,
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'all-users' as const,
    },
    showWalletUIs: false,
  },
}; 