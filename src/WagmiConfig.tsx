'use client';

import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

let connectors = [];
if (typeof window !== 'undefined')
  connectors.push(
    coinbaseWallet({
      appName: 'My Wagmi App',
    }),
  );

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  connectors,
});

export default function WagmiProviderCustom({ children }: { children: ReactNode }) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
