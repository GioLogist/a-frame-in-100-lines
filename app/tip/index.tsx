'use client';
import * as React from 'react';
import { type BaseError, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { TipPageType } from './page';

type TipPageExtendedType = { user: any };
export default function SendTip({ searchParams, user }: TipPageType & TipPageExtendedType) {
  const { data: hash, error, isPending, sendTransaction } = useSendTransaction();
  console.log('@@searchParams', searchParams, user);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const to = formData.get('address') as `0x${string}`;
    const value = formData.get('value') as string;
    sendTransaction({
      to: searchParams.to,
      value: parseEther(searchParams.amount),
      chainId: baseSepolia.id,
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  return (
    <div className="modal">
      <form onSubmit={submit}>
        <input name="address" placeholder="0xA0Cf…251e" required />
        <input name="value" placeholder="0.05" required value={searchParams.amount} />
        <button disabled={isPending} type="submit">
          {isPending ? 'Confirming...' : 'Send'}
        </button>
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && <div>Error: {(error as BaseError).shortMessage || error.message}</div>}
      </form>
      {JSON.stringify(user, null, 2)}
    </div>
  );
}
