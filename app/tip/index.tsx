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
      <div className="modal-header">
        {/* */}
        Sending
        <div style={{ fontSize: 32 }}>🫡 {searchParams.amount} ETH</div>
        to: <span style={{ color: 'black', fontWeight: 'bold' }}>{user.display_name}</span>
        <div className="muted">({searchParams.to})</div>
        <div style={{ height: 150, width: 150, overflow: 'hidden', margin: '25px auto 0 auto' }}>
          <img src={user.pfp_url} className="avatar" />
        </div>
      </div>
      <div className="modal-body">
        <form onSubmit={submit}>
          {/* <input name="address" placeholder="0xA0Cf…251e" required />
          <input name="value" placeholder="0.05" required value={searchParams.amount} /> */}
          {!hash && (
            <button disabled={isPending} type="submit" className="btn-lg page-bg mb-2">
              {isPending ? 'Confirming...' : 'Send'}
            </button>
          )}
          {hash && (
            <div className="mt-3">
              <div style={{ fontSize: 32 }}>🤙🏻 Success!</div>

              <div className="mt-3">
                View your transaction on{' '}
                <a href={`https://base-sepolia.blockscout.com/tx/${hash}`} target="_blank">
                  BlockScout
                </a>
              </div>
            </div>
          )}
          {isConfirming && <div className="mt-3">Waiting for confirmation...</div>}
          {isConfirmed && <div className="mt-3">Transaction confirmed.</div>}
          {error && (
            <div className="mt-3">Error: {(error as BaseError).shortMessage || error.message}</div>
          )}
        </form>
        {/* {JSON.stringify(user, null, 2)} */}
      </div>
    </div>
  );
}
