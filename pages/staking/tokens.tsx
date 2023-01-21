import Nav from '../../components/Nav'
import TOKENABI from '../../config/TOKENABI.json'
import TokenStakingABI from '../../config/TokenStakingABI.json'
import { useAccount } from 'wagmi'
import { usePrepareContractWrite, useContractWrite, useContractRead } from 'wagmi'
import { tokenStaking, tokenContract } from '../../config/config'
import { useState } from 'react'
import { ethers } from 'ethers'

 const tokens = () => {

  const [quantity, setQuantity] = useState(1);

  const { address, isConnecting, isDisconnected } = useAccount()

  const { data: tokenBal, isLoading: LoadingTBal } = useContractRead({
    address: tokenContract,
    abi: TOKENABI,
    functionName: 'balanceOf',
    args: [address]
  })

  const { data: approval } = useContractRead({
    address: tokenContract,
    abi: TOKENABI,
    functionName: 'allowance',
    args: [address, tokenStaking]
  })

  const { data: earned, isLoading: LoadingEarned } = useContractRead({
    address: tokenStaking,
    abi: TokenStakingABI,
    functionName: 'earned',
    args: [address]
  })

  const { data: rewardRate} = useContractRead({
    address: tokenStaking,
    abi: TokenStakingABI,
    functionName: 'rewardRate'
  })


  const { data: staked, isLoading: LoadingStaked } = useContractRead({
    address: tokenStaking,
    abi: TokenStakingABI,
    functionName: '_stakes',
    args: [address]
  })


  //const Rewards = (parseInt(pending)/1E18).toFixed(3)
  const balance = (parseInt(tokenBal)/1E18).toFixed(3)
  const tokensEarned = (parseInt(earned)/1E18).toFixed(3)
  const tokensStaked = (parseInt(staked?.balance)/1E18).toFixed(3)

  const tokensAllowance = (parseInt(approval))

  const { config } = usePrepareContractWrite({
    address: tokenContract,
    abi: TOKENABI,
    functionName: 'approve',
    args: [tokenStaking, ethers.utils.parseUnits('100000000000', 'ether')]
  })
  const { data, isLoading, isSuccess, write: approve } = useContractWrite(config)

  const { config: claimConfig } = usePrepareContractWrite({
    address: tokenStaking,
    abi: TokenStakingABI,
    functionName: 'claim'
  })

  const { data: claimdata, isLoading: loadingClaim, isSuccess: claimSucc, write: claim } = useContractWrite(claimConfig)

  const { config: stakeConfig } = usePrepareContractWrite({
    address: tokenStaking,
    abi: TokenStakingABI,
    functionName: 'stake',
    args: [ethers.utils.parseUnits((quantity).toString(), 'ether')]
  })

  const { data: stkdata, isLoading: loading, isSuccess: stakeSucc, write: stake } = useContractWrite(stakeConfig)

  const { config: unstakeConfig } = usePrepareContractWrite({
    address: tokenStaking,
    abi: TokenStakingABI,
    functionName: 'unstake',
    args: [ethers.utils.parseUnits((quantity).toString(), 'ether')]
  })

  const { data: unstkData, isLoading: loadingUnstk, isSuccess: unstakeSucc, write: unstake } = useContractWrite(unstakeConfig)
  
  return (
    <div className="bg-[#14181d] min-h-screen flex space-y-10 flex-col">
      <Nav />
      <div className="stats-container mx-6 text-center">
        <h1 className="text-2xl text-white font-semibold text-center md:text-3xl">
          {" "}
          Details{" "}
        </h1>
        <div className="flex justify-between space-y-3 flex-col md:flex-row md:justify-between p-1 md:space-x-2">
          <div className="stats mt-3">
            <h2 className="text-sm">Pending Rewards</h2>
            <p className="text-xl extra text-blue-400 font-semibold">{LoadingEarned ?  0: tokensEarned} TKN</p>
          </div>
          <div className="stats">
            <h2 className="text-sm">APY</h2>
            <p className="text-xl extra text-blue-400 font-semibold">{parseInt(rewardRate)}%</p>
          </div>
          <div className="stats">
            <h2 className="text-sm">Wallet Balance</h2>
            <p className="text-xl extra flex flex-row justify-center items-center text-center text-blue-400 font-semibold">
              <span id="balance">{LoadingTBal ? 0 : balance}</span>&nbsp;TKN&nbsp;
            </p>
          </div>
          <div className="stats">
            <h2 className="text-sm">Staked Tokens
            </h2>
            <p className="text-xl extra flex flex-row justify-center items-center text-center text-blue-400 font-semibold">
              <span id="balance">{LoadingStaked ? 0 : tokensStaked}</span>&nbsp;TKN&nbsp;
            </p>
          </div>
        </div>
        <div className="items-center flex justify-center text-center mt-3">
          <button disabled={!claim} onClick={() => claim?.()}  className="px-4 py-2 text-sm text-blue-100 hover:bg-blue-600 bg-blue-500 rounded shadow">
            Claim Rewards
          </button>
        </div>
      </div>
      <div className="stats-container m-6 space-y-2">
        <div className="stats-container">
          <div className="flex extra justify-center items-center text-white pb-2">
            <h4 className="extra">Stake Your TNK Tokens</h4>
          </div>

          <div className="flex items-center m-5 space-x-2 text-white bg-[#061114] border-[#293542] border p-4">
            <p className="extra">AMOUNT</p>
            <input
              className="flex w-full bg-transparent text-right outline-none"
              type="number"
              placeholder='1'
              onChange={e => setQuantity(Number(e.currentTarget.value))}
            />
          </div>
        </div>

        <div className="stats text-center">
          {quantity * 1E18 > tokensAllowance ?
          <button disabled={!approve} onClick={() => approve?.()} className="px-4 py-2 text-sm text-blue-100 hover:bg-blue-600 bg-blue-500 rounded shadow">
          Approve To Stake
        </button>
        :
        <div className='flex flex-row justify-center space-x-2'>
            <button disabled={!stake} onClick={() => stake?.()} className="px-4 py-2 text-sm text-blue-100 hover:bg-blue-600 bg-blue-500 rounded shadow">
            Stake Tokens
          </button>
          <button disabled={!unstake} onClick={() => unstake?.()} className="px-4 py-2 text-sm text-blue-100 hover:bg-blue-600 bg-blue-500 rounded shadow">
            unstake Tokens
          </button>
          </div>
          }
        </div>
      </div>
    </div>
  );
}

export default tokens