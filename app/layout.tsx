import WagmiProviderCustom from '../src/WagmiConfig';
import QueryProvider from '../src/QueryProvider';
import '../src/globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="page-bg">
        <WagmiProviderCustom>
          <QueryProvider>{children}</QueryProvider>
        </WagmiProviderCustom>
      </body>
    </html>
  );
}
