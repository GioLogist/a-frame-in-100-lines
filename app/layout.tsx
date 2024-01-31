import { WagmiProvider } from 'wagmi';
import { config } from '../wagmi-config';
import QueryProvider from '../src/QueryProvider';

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <WagmiProvider config={config}>
        <QueryProvider>
          <body>{children}</body>
        </QueryProvider>
      </WagmiProvider>
    </html>
  );
}
