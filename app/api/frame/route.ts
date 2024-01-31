import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

export const tipButtons = [
  {
    amount: '0.000001',
    label: '🫡 0.000001',
    action: 'post_redirect',
  },
  {
    amount: '0.000002',
    label: '🙏🏻 0.000002',
    action: 'post_redirect',
  },
  {
    amount: '0.000003',
    label: '🥹 0.000003',
    action: 'post_redirect',
  },
  {
    amount: '0.000004',
    label: '🎉 0.000004',
    action: 'post_redirect',
  },
];

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const searchParams = req.nextUrl.searchParams;
  const queryString = searchParams.toString();
  console.log('@@query', queryString);

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body);

  let castCustodyAddress: string | undefined;

  if (isValid) {
    try {
      const usersResponse = await getUsersByFid(String(message.castId.fid));
      console.log('@@usersResponse', usersResponse);
      castCustodyAddress = usersResponse?.users?.[0].custody_address; // user who interacted
      console.log('@@castCustodyAddress', castCustodyAddress);
    } catch (err) {
      console.log('@@testing', err);
      console.error(err);
    }
  }

  console.log(
    '@@castCustodyAddress',
    castCustodyAddress,
    'isValid',
    isValid,
    'message',
    message,
    'body',
    body,
  );

  const amount = message?.buttonIndex && tipButtons[message?.buttonIndex - 1].amount;
  const url = `${process.env.NEXT_PUBLIC_URL}/tip?amount=${amount}&fid=${message?.castId.fid}`;

  return new Response('OK', {
    status: 302,
    headers: {
      location: url,
    },
  });

  // return new NextResponse(`<!DOCTYPE html><html><head>
  //   <meta property="fc:frame" content="vNext" />
  //   <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/buy-coffee.WEBP" />
  //   // <meta property="fc:frame:button:1" content="${castCustodyAddress}" />
  //   // <meta property="fc:frame:button:2" content="${tipButtons[1].text}"/>
  //   <meta property="fc:frame:button:2:action" content="post_redirect" />
  //   <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame?to=${castCustodyAddress}&fid=${message?.fid}" />
  // </head></html>`);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export type GetUsersByFid = {
  users:
    | [{ fid: number; custody_address: `0x${string}`; display_name: string; pfp_url: string }]
    | undefined;
};
export function getUsersByFid(fids: string): Promise<GetUsersByFid> {
  const options = {
    method: 'GET',
    headers: { accept: 'application/json', api_key: 'NEYNAR_API_DOCS' },
  };

  return fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));
}

export const dynamic = 'force-dynamic';
