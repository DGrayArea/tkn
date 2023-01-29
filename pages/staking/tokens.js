import React from "react";
import Meta from "../../components/Meta";
import TOKENABI from "../../config/TOKENABI.json";
import TokenStakingABI from "../../config/TokenStakingABI.json";
import { useAccount } from "wagmi";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
} from "wagmi";
import { tokenStaking, tokenContract } from "../../config/config";
import { useState } from "react";
import { ethers } from "ethers";

export default function Tokens() {
  const [quantity, setQuantity] = useState(1);

  const { address, isConnecting, isDisconnected } = useAccount();

  const { data: tokenBal, isLoading: LoadingTBal } = useContractRead({
    address: tokenContract,
    abi: TOKENABI,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: approval } = useContractRead({
    address: tokenContract,
    abi: TOKENABI,
    functionName: "allowance",
    args: [address, tokenStaking],
  });

  const { data: earned, isLoading: LoadingEarned } = useContractRead({
    address: tokenStaking,
    abi: TokenStakingABI,
    functionName: "earned",
    args: [address],
  });

  const { data: rewardRate } = useContractRead({
    address: tokenStaking,
    abi: TokenStakingABI,
    functionName: "rewardRate",
  });

  const { data: staked, isLoading: LoadingStaked } = useContractRead({
    address: tokenStaking,
    abi: TokenStakingABI,
    functionName: "_stakes",
    args: [address],
  });

  //const Rewards = (parseInt(pending)/1E18).toFixed(3)
  const balance = (parseInt(tokenBal) / 1e18).toFixed(2);
  const tokensEarned = (parseInt(earned) / 1e18).toFixed(2);
  const tokensStaked = (parseInt(staked?.balance) / 1e18).toFixed(2);

  const tokensAllowance = parseInt(approval);

  const { config } = usePrepareContractWrite({
    address: tokenContract,
    abi: TOKENABI,
    functionName: "approve",
    args: [tokenStaking, ethers.utils.parseUnits("100000000000", "ether")],
  });
  const {
    data,
    isLoading,
    isSuccess,
    write: approve,
  } = useContractWrite(config);

  const { config: claimConfig } = usePrepareContractWrite({
    address: tokenStaking,
    abi: TokenStakingABI,
    functionName: "claim",
  });

  const {
    data: claimdata,
    isLoading: loadingClaim,
    isSuccess: claimSucc,
    write: claim,
  } = useContractWrite(claimConfig);

  const { config: stakeConfig } = usePrepareContractWrite({
    address: tokenStaking,
    abi: TokenStakingABI,
    functionName: "stake",
    args: [ethers.utils.parseUnits(quantity.toString(), "ether")],
  });

  const {
    data: stkdata,
    isLoading: loading,
    isSuccess: stakeSucc,
    write: stake,
  } = useContractWrite(stakeConfig);

  const { config: unstakeConfig } = usePrepareContractWrite({
    address: tokenStaking,
    abi: TokenStakingABI,
    functionName: "unstake",
    args: [ethers.utils.parseUnits(quantity.toString(), "ether")],
  });

  const {
    data: unstkData,
    isLoading: loadingUnstk,
    isSuccess: unstakeSucc,
    write: unstake,
  } = useContractWrite(unstakeConfig);

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
            <p className="text-xl extra text-blue-400 font-semibold">
              {LoadingEarned ? 0 : (tokensEarned)} HUFO
            </p>
          </div>
          <div className="stats">
            <h2 className="text-sm">APY</h2>
            <p className="text-xl extra text-blue-400 font-semibold">
              {parseInt(rewardRate)}%
            </p>
          </div>
          <div className="stats">
            <h2 className="text-sm">Wallet Balance</h2>
            <p className="text-xl extra flex flex-row justify-center items-center text-center text-blue-400 font-semibold">
              <span id="balance">{LoadingTBal ? 0 : balance}</span>
              &nbsp;HUFO&nbsp;
            </p>
          </div>
          <div className="stats">
            <h2 className="text-sm">Staked Tokens</h2>
            <p className="text-xl extra flex flex-row justify-center items-center text-center text-blue-400 font-semibold">
              <span id="balance">{LoadingStaked ? 0 : tokensStaked}</span>
              &nbsp;HUFO&nbsp;
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

      <div className="rounded-2.5xl border border-jacarta-100 bg-white p-12 text-center transition-shadow hover:shadow-xl mt-12 dark:border-jacarta-600 dark:bg-jacarta-700 mx-4 md:mx-8 lg:mx-20">
        <h3 className="mb-1 font-display text-lg text-jacarta-700 dark:text-white">
        STAKE YOUR HUFO
        </h3>
        <div className='flex rounded-xl items-center m-5 space-x-2 text-white bg-[#061114] border-[#293542] border p-4'>
            <p className='extra'>AMOUNT</p>
          <input type='number' className="bg-transparent text-white outline-none w-full text-center border-none rounded-lg" />
        </div>
        <div className="items-center flex justify-center text-center mt-3">
        {quantity * 1E18 > tokensAllowance ?
          <button disabled={!approve} onClick={() => approve?.()}             className="js-video-modal-trigger items-center justify-center transition-transform will-change-transform inline-block rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mx-[6px]">
          Approve To Stake
        </button>
        :
        <>
          <button
            disabled={!stake} onClick={() => stake?.()}
            className="js-video-modal-trigger items-center justify-center transition-transform will-change-transform inline-block rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mx-[6px]"
          >
            Stake
          </button>

          <button
            disabled={!unstake} onClick={() => unstake?.()}
            className="js-video-modal-trigger items-center justify-center transition-transform will-change-transform inline-block rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mx-[6px]"
          >
            Unstake
          </button>
          </>
}
        </div>
      </div>
    </div>
  );
};
