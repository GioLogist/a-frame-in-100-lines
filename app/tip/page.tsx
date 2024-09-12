import { GetUsersByFid, getUsersByFid } from '../api/frame/route';
import TipPage from './';

export type TipPageType = {
  searchParams: { address?: string; amount: string; to: `0x${string}`; fid: string };
};

async function getUserByFid(
  fid: string,
): Promise<NonNullable<GetUsersByFid['users']>[0] | undefined> {
  const usersResponse = await getUsersByFid(fid);
  return usersResponse?.users?.[0];
}

export default async function Page({ searchParams }: TipPageType) {
  const user = await getUserByFid(searchParams.fid);

  if (!user) {
    return <div>user not found</div>;
  }

  return <TipPage searchParams={searchParams} user={user} />;
}
