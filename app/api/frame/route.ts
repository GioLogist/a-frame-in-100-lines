import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import makeDebug from 'debug';

const debug = makeDebug('@@tip:debug');

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
  debug('@@query', queryString);

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body);

  let castCustodyAddress: string | undefined;

  if (isValid) {
    try {
      const usersResponse = await getUsersByFid(String(message.castId.fid));
      debug('@@usersResponse', usersResponse);
      castCustodyAddress = usersResponse?.users?.[0].custody_address; // user who interacted
      debug('@@castCustodyAddress', castCustodyAddress);
    } catch (err) {
      console.error(err);
      return new Response('NOT OK', {
        status: 401,
      });
    }
  }

  debug(
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
