'use client'

import { PublicKey } from '@solana/web3.js'
// import { ellipsify } from '../ui/ui-layout'
// import { ExplorerLink } from '../cluster/cluster-ui'
import { 
  useCrudappProgram, 
  useCrudappProgramAccount 
} from './crudapp-data-access';

import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'

export function CrudappCreate() {
  const [ title, setTitle ] = useState('');
  const [ message, setMessage ] = useState('');
  const { createEntry } = useCrudappProgram();
  const { publicKey } = useWallet();

  const isFormValid = title.trim() !== '' && message.trim() !== '';

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      createEntry.mutateAsync({ title, message, owner: publicKey });
      // .mutateAsync({ title, message, owner: publicKey });
    }
  };
 
  if(!publicKey) {
    return <p> Please Connect Your Wallet. </p>
  }

  return (
    <div>
      <input
        type='text'
        placeholder='title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='input input-bordered w-full max-w-xs'
      />
      <textarea
        placeholder='Message'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className='textarea textarea-bordered w-full max-w-xs'
      />
      <button
        onClick={handleSubmit}
        disabled={createEntry.isPending || !isFormValid}
        className='btn btn-xs lg:btn-md btn-primary'
      />
    </div>
    // <button
    //   className="btn btn-xs lg:btn-md btn-primary"
    //   onClick={() => initialize.mutateAsync(Keypair.generate())}
    //   disabled={initialize.isPending}
    // >
    //   Create {initialize.isPending && '...'}
    // </button>
  );
}

export function CrudappList() {
  const { accounts, getProgramAccount } = useCrudappProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <CrudappCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  )
}

function CrudappCard({ account }: { account: PublicKey }) {
  const { 
    accountQuery, updateEntry, deleteEntry
    // incrementMutation, setMutation,  decrementMutation,  closeMutation 
  } = useCrudappProgramAccount({ account });

  const { publicKey } = useWallet();

  const [ message, setMessage ] = useState("");
  const title = accountQuery.data?.title;

  const isFormValid = message.trim() !== '';

  const handleSubmit = () => {
    if (publicKey && isFormValid && title) {
      updateEntry.mutateAsync({ title, message, owner: publicKey });
    }
  };

  if(!publicKey) {
    return <p> Please Connect Your Wallet. </p>
  }


  // const count = useMemo(() => accountQuery.data?.count ?? 0, [accountQuery.data?.count])

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2 className="card-title justify-center text-3xl cursor-pointer" 
          onClick={() => accountQuery.refetch()}>
            {accountQuery.data?.title}
          </h2>
          <p> {accountQuery.data?.message}</p>
          <div className="card-actions justify-around">
            <textarea 
              placeholder='Message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='textarea textarea-bordered w-full max-w-xs'
            />
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={handleSubmit}
              disabled={updateEntry.isPending || isFormValid}
            >
              Update Journal Entry
            </button>
            <button
              onClick={() => {
                const title = accountQuery.data?.title;
                if(title) {
                  return deleteEntry.mutateAsync(title);
                }
              }
            }
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



//import { useMemo } from 'react'

            {/* <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={() => decrementMutation.mutateAsync()}
              disabled={decrementMutation.isPending}
            >
              Decrement
            </button> */}


 {/* <div className="text-center space-y-4">
            <p>
              <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (!window.confirm('Are you sure you want to close this account?')) {
                  return
                }
                return closeMutation.mutateAsync()
              }}
              disabled={closeMutation.isPending}
            >
              Close
            </button>
          </div> */}




