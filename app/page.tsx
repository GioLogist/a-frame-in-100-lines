import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { tipButtons } from './api/frame/route';

const frameMetadata = getFrameMetadata({
  // @ts-ignore
  buttons: tipButtons,
  image: `${process.env.NEXT_PUBLIC_URL}/buy-coffee.WEBP`,
  post_url: `${process.env.NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_URL,
  description: 'LFG',
  openGraph: {
    title: process.env.NEXT_PUBLIC_URL,
    description: 'LFG',
    images: [`${process.env.NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>{process.env.NEXT_PUBLIC_URL}</h1>
      <img
        style={{ maxWidth: '100%' }}
        src="/buy-coffee.WEBP"
        alt="A Farcaster frame to buy a user coffee"
      />
    </>
  );
}
