import React, { Dispatch, SetStateAction, useState } from "react";
import { usePrepareContractWrite, useContractWrite, useContractRead, useAccount } from 'wagmi'
import { nftContract, tokenContract } from '../config/config'
import NFTABI from '../config/NFTABI.json'
import TOKENABI from '../config/TOKENABI.json'
import { ethers } from 'ethers'

export default function Modal({ show, setShow, isToken, apprval }) {
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(0)
  const [totalToken, setTotalToken] = useState(0)
  const { address, isConnecting, isDisconnected } = useAccount()

  const { config } = usePrepareContractWrite({
    address: tokenContract,
    abi: TOKENABI,
    functionName: 'approve',
    args: [nftContract, ethers.utils.parseUnits('100000000000', 'ether')]
  })

  const { data, isLoading, isSuccess, write: approve } = useContractWrite(config)

  const { config: MintTokens } = usePrepareContractWrite({
    address: nftContract,
    abi: NFTABI,
    functionName: 'MintWithToken',
    args: [address, quantity]
  })

  const { data: Token, isLoading:TokenMint, write: MintToken } = useContractWrite(MintTokens)

  const { data: approval } = useContractRead({
    address: tokenContract,
    abi: TOKENABI,
    functionName: 'allowance',
    args: [address, nftContract]
  })

  const { data: cost } = useContractRead({
    address: nftContract,
    abi: NFTABI,
    functionName: 'cost'
  })

  const { data: tokenCost } = useContractRead({
    address: nftContract,
    abi: NFTABI,
    functionName: 'tokenCost'
  })

  const qty = (parseInt(cost) * quantity).toString()

  const { config: Mint } = usePrepareContractWrite({
    address: nftContract,
    abi: NFTABI,
    functionName: 'mint',
    args: [address, quantity],
    overrides: {
      from: address,
      value: qty,
    },

  })

  const { data: ETH, isLoading:ETHMint, write: MintETH } = useContractWrite(Mint)

  const tokensAllowance = (parseInt(approval))
  const tCost = (parseInt(tokenCost)/1E18).toFixed(2)
  const eCost = (parseInt(cost)/1E18).toFixed(2)

  const setCosts = (qty) => {
    setQuantity(qty)
    setTotalCost(eCost * qty)
  }


  const setToken = (qty) => {
    setQuantity(qty)
    setTotalToken(tCost * qty)
  }

  if (isToken) {
  return (
    <>
      {show ? (
        <div className="fixed top-10 flex items-center justify-center p-10 left-0 right-0 bottom-0 bg-opacity-20 bg-black z-10">
        <div className="bg-black p-10 rounded-lg max-w-2xl z-50 relative overflow-y-scroll">
          <div
            className="absolute top-5 right-5 bg-gray-300 p-3 rounded-full hover:bg-gray-400 transition-all cursor-pointer"
            onClick={() => setShow(false)}
          >
            <img
              src="https://iconape.com/wp-content/png_logo_vector/cross-2.png"
              className="h-3 w-3"
            />
          </div>
          <div className="font-bold text-white text-2xl">Mint with Tokens!</div>
          <div className='mt-2 text-blue-400 text-center pb-2'>
              <h4 className=''>1 NFT costs {tCost} TKN</h4>
            </div>
          <div className='flex items-center m-5 space-x-2 text-white bg-[#061114] border-[#293542] border p-4'>
            <p className='extra'>AMOUNT</p>
            <input
              className="flex w-full bg-transparent text-right outline-none"
              type="number"
              placeholder='1'
              onChange={e => setToken(Number(e.currentTarget.value))}
            />
          </div>
          <div className="mt-5 space-y-2 space-x-3">
          <div className='flex items-center justify-between text-blue-400 text-sm italic font-extrabold'>
                <p className='extra'>Total cost</p>
                <p className='extra'>{totalToken} TKN</p>
              </div>
              <div className='flex items-center justify-between text-blue-400 text-xs italic'>
                <p className='extra'>+ Network Fees</p>
                <p className='extra'>TBC</p>
              </div>
            {quantity * 1E18 > tokensAllowance ?
              <button  disabled={!approve} onClick={() => approve?.()} className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all">
               Approve to Mint
            </button>
            :
            <button disabled={!MintToken} onClick={() => MintToken?.()} className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all">
               Mint With Tokens
            </button>
            }
          </div>
        </div>
      </div>
      ) : null
      }
    </>
  );
    } else {
      return (
        <>
          {show ? (
        <div className="fixed top-10 flex items-center justify-center p-10 left-0 right-0 bottom-0 bg-opacity-20 bg-black z-10">
        <div className="bg-black p-10 rounded-lg max-w-2xl z-50 relative overflow-y-scroll">
          <div
            className="absolute top-5 right-5 bg-gray-300 p-3 rounded-full hover:bg-gray-400 transition-all cursor-pointer"
            onClick={() => setShow(false)}
          >
            <img
              src="https://iconape.com/wp-content/png_logo_vector/cross-2.png"
              className="h-3 w-3"
            />
          </div>
          <div className="font-bold text-white text-2xl">Mint with ETH!</div>
          <div className='mt-2 text-blue-400 text-center pb-2'>
              <h4 className=''>1 NFT costs {eCost} ETH</h4>
            </div>
          <div className='flex items-center m-5 space-x-2 text-white bg-[#061114] border-[#293542] border p-4'>
            <p className='extra'>AMOUNT</p>
            <input className='flex w-full bg-transparent text-right outline-none' type='number' onChange={e => setCosts(Number(e.currentTarget.value))} />
          </div>
          <div className="mt-5 space-y-2 space-x-3">
          <div className='flex items-center justify-between text-blue-400 text-sm italic font-extrabold'>
                <p className='extra'>Total cost</p>
                <p className='extra'>{totalCost.toFixed(2)} ETH</p>
              </div>
              <div className='flex items-center justify-between text-blue-400 text-xs italic'>
                <p className='extra'>+ Network Fees</p>
                <p className='extra'>TBC</p>
              </div>
            <button disabled={!MintETH} onClick={() => MintETH?.()} className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all">
               Mint
            </button>
          </div>
        </div>
      </div>
          ) : null
          }
        </>
      );
    }
}
