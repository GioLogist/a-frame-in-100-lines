import { getUsersByFid } from '../api/frame/route';
import TipPage from './';

export type TipPageType = {
  searchParams: { address?: string; amount: string; to: `0x${string}`; fid: string };
};

async function getUserByFid(fid: string) {
  const usersResponse = await getUsersByFid(fid);
  return usersResponse?.users?.[0];
}

export default async function Page({ searchParams }: TipPageType) {
  const user = await getUserByFid(searchParams.fid);
  console.log('@@user', user);

  return <TipPage searchParams={searchParams} user={user} />;
}
