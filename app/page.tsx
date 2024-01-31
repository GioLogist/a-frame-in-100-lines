import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'We love BOAT',
    },
  ],
  image: `${process.env.NEXT_PUBLIC_URL}/park-1.png`,
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
    </>
  );
}
