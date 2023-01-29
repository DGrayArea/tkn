import NftCard from '../../components/NftCard'
import Meta from "../../components/Meta";
import { useContractRead } from 'wagmi'
import { nftContract, tokenContract, nftStaking } from '../../config/config'
import NFTABI from '../../config/NFTABI.json'
import TOKENABI from '../../config/TOKENABI.json'
import NftStakingABI from '../../config/NftStakingABI.json'
import { useAccount } from 'wagmi'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'

export default function Nfts() {

  const { address, isConnecting, isDisconnected } = useAccount()

  const { data: unstakedNFTS, isLoading: loadingNFTs } = useContractRead({
    address: nftContract,
    abi: NFTABI,
    functionName: 'walletOfOwner',
    args: [address]
  })

  const { data: approval } = useContractRead({
    address: nftContract,
    abi: NFTABI,
    functionName: 'isApprovedForAll',
    args: [address, nftStaking]
  })

  const { data: pending, isLoading: LoadingRewards } = useContractRead({
    address: nftStaking,
    abi: NftStakingABI,
    functionName: 'availableRewards',
    args: [address]
  })

  const { data: tokenBal, isLoading: LoadingTBal } = useContractRead({
    address: tokenContract,
    abi: TOKENABI,
    functionName: 'balanceOf',
    args: [address]
  })

  const { data: stakedTokens, isLoading: isLoadingStaked } = useContractRead({
    address: nftStaking,
    abi: NftStakingABI,
    functionName: 'getStakedTokens',
    args: [address]
  })
  const Rewards = (parseInt(pending)/1E18).toFixed(3)
  const balance = (parseInt(tokenBal)/1E18).toFixed(3)

  const { config } = usePrepareContractWrite({
    address: nftContract,
    abi: NFTABI,
    functionName: 'setApprovalForAll',
    args: [nftStaking, true]
  })
  const { data, isLoading, isSuccess, write: approve } = useContractWrite(config)

  const { config: claimConfig } = usePrepareContractWrite({
    address: nftStaking,
    abi: NftStakingABI,
    functionName: 'claimRewards'
  })
  const { data: claimData, isLoading: loadingClaim, isSuccess: successClaim, write: claim } = useContractWrite(claimConfig)

  const stkArr = []
  const unstkArr = []

  unstakedNFTS?.map((nft) => {
    stkArr.push(parseInt(nft))
  })

  stakedTokens?.map((nft) => {
    unstkArr.push(parseInt(nft.tokenId))
  })

  const { config: stakeConfig } = usePrepareContractWrite({
    address: nftStaking,
    abi: NftStakingABI,
    functionName: 'stake',
    args: [stkArr]
  })

  const { data: stakeData, isLoading: stakeLoad, isSuccess: success, write: stakeAll } = useContractWrite(stakeConfig)

  const { config: unstakConfig } = usePrepareContractWrite({
    address: nftStaking,
    abi: NftStakingABI,
    functionName: 'withdraw',
    args: [unstkArr]
  })

  const { data: unstakeData, isLoading: loading, isSuccess: succ, write: unstakeAll } = useContractWrite(unstakConfig)
  return (
    <div className="mt-[95px]">
      <Meta title="Holey Aliens" />
      <div className="rounded-2.5xl border border-jacarta-100 bg-white p-12 text-center transition-shadow hover:shadow-xl dark:border-jacarta-600 dark:bg-jacarta-700 mx-4 md:mx-8 lg:mx-20">
        <h3 className="mb-1 font-display text-lg text-jacarta-700 dark:text-white">
          DETAILS
        </h3>
        <div className="flex justify-between space-y-3 flex-col md:flex-row md:justify-center md:space-x-12 lg:space-x-24 p-1">
          <div className="stats mt-3">
            <h2 className="text-sm">Pending Rewards</h2>
            <p className="text-xl extra text-blue-400 font-semibold">{LoadingRewards ? 0 : Rewards} TKN</p>
          </div>
          <div className="stats">
		  <h2 className="text-sm">Daily RATE</h2>
            <p className="text-xl extra text-blue-400 font-semibold">24 HUFO Per NFT</p>
          </div>
          <div className="stats">
		  <h2 className="text-sm">Wallet Balance</h2>
            <p className="text-xl extra flex flex-row justify-center items-center text-center text-blue-400 font-semibold">
              <span id="balance">{LoadingTBal ? 0 : balance}</span>&nbsp;TKN&nbsp;
            </p>
          </div>
          <div className="stats">
		  <h2 className="text-sm">Staked NFTs</h2>
            <p className="text-xl extra flex flex-row justify-center items-center text-center text-blue-400 font-semibold">
              <span id="balance">{stakedTokens?.length}</span>&nbsp;NFTs&nbsp;
            </p>
          </div>
        </div>
        <div className="items-center flex justify-center text-center mt-3">
          <button
            disabled={!claim}
            onClick={() => claim?.()}
            className="js-video-modal-trigger items-center justify-center transition-transform will-change-transform inline-block rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mx-[6px]"
          >
            Claim Rewards
          </button>
        </div>
      </div>

      <div className="stats-container m-6 space-y-2">
      <div className="flex extra justify-center items-center text-white pb-2">
            <h4 className="extra font-bold text-2xl underline">Owned NFTs</h4>
          </div>
          <div className='text-center flex items-center justify-center mt-8'>
            {!approval ?
           <button disabled={!approve} onClick={() => approve?.()} cclassName="js-video-modal-trigger items-center justify-center transition-transform will-change-transform inline-block rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mx-[6px]">
           Approve to stake
          </button>
          :
          null
            }
          </div>
        <div
		className="rounded-2.5xl border border-jacarta-100 bg-white p-2 md:p-12 text-center transition-shadow hover:shadow-xl dark:border-jacarta-600 dark:bg-jacarta-700 mx-4 md:mx-8 lg:mx-20" >
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  md:space-x-4 justify-center gap-4">
          {loadingNFTs ? 
          null
          :
          unstakedNFTS?.map((nft, index) => {
            const nftId = parseInt(nft)
            return (
            <NftCard
              key={index}
              status={false}
              tokenId={nftId}
              index={index?.toString()}
              />
            )
          })
          }
           </div>
           <div className='text-center flex items-center justify-center mt-8'>
           <button disabled={!stakeAll} onClick={() => stakeAll?.()} className="js-video-modal-trigger items-center justify-center transition-transform will-change-transform inline-block rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mx-[6px]">
           Stake All
          </button>
          </div>
        </div>

        <div className="flex extra justify-center items-center text-white pb-2">
            <h4 className="extra font-bold text-2xl underline">Staked NFTs</h4>
          </div>
		  <div
		className="rounded-2.5xl border border-jacarta-100 bg-white p-2 md:p-12 text-center transition-shadow hover:shadow-xl dark:border-jacarta-600 dark:bg-jacarta-700 mx-4 md:mx-8 lg:mx-20" >
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  md:space-x-4 justify-center gap-4">
          {isLoadingStaked ? 
          null
          :
          stakedTokens?.map((nft, index) => {
            const nftId = parseInt(nft.tokenId)
            return (
            <NftCard
              key={index}
              status={true}
              tokenId={nftId}
              index={index?.toString() + 'nft'}
              />
            )
          })
          }
           </div>
           <div className='text-center flex items-center justify-center mt-8'>
           <button disabled={!unstakeAll} onClick={() => unstakeAll?.()} className="js-video-modal-trigger items-center justify-center transition-transform will-change-transform inline-block rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mx-[6px]">
           Unstake All
          </button></div>
        </div>
      </div>
    </div>
  );
};
