import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
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

  if (searchParams.get('amount')) {
    const url = `${process.env.NEXT_PUBLIC_URL}/tip?amount=${searchParams.get('amount')}&to=${searchParams.get('to')}`;
    // @ts-ignore
    return new Response('OK', {
      status: 301,
      headers: {
        locoation: url,
      },
    });
  }

  return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/park-2.png" />
    <meta property="fc:frame:button:1" content="${castCustodyAddress}" />
    <meta property="fc:frame:button:2" content="🫡 Tip 0.000001" />
    <meta property="fc:frame:button:2:action" content="post_redirect" />
    <meta property="fc:frame:button:2:post_url" content="${process.env.NEXT_PUBLIC_URL}/tip?amount=0.000001&to=${castCustodyAddress}" />
    <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/frame" />
  </head></html>`);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export type GetUsersByFid = Promise<{
  users:
    | [{ fid: number; custody_address: string; display_name: string; pfp_url: string }]
    | undefined;
}>;
export function getUsersByFid(fids: string): GetUsersByFid {
  const options = {
    method: 'GET',
    headers: { accept: 'application/json', api_key: 'NEYNAR_API_DOCS' },
  };

  return fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err)) as any as GetUsersByFid;
}

export const dynamic = 'force-dynamic';
