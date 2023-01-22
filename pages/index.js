import Head from "next/head";
import { useState } from "react";
import Modal from '../components/Modal'
import Nav from "../components/Nav";
import { useAccount } from 'wagmi'
import { usePrepareContractWrite, useContractWrite, useContractRead } from 'wagmi'
import { nftContract, tokenContract } from '../config/config'
import NFTABI from '../config/NFTABI.json'
import TOKENABI from '../config/TOKENABI.json'
import { ethers } from 'ethers'
import truncateEthAddress from 'truncate-eth-address'

const Home = () => {

  const { address, isConnecting, isDisconnected } = useAccount()

  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showEthModal, setShowEthModal] = useState(false);

  const { data: supply, isLoading: loadingSupply } = useContractRead({
    address: nftContract,
    abi: NFTABI,
    functionName: 'totalSupply',
  })

  const { data: tokenBal, isLoading: LoadingTBal } = useContractRead({
    address: nftContract,
    abi: NFTABI,
    functionName: 'balanceOf',
    args: [address]
  })

  const { data: tokenCost } = useContractRead({
    address: nftContract,
    abi: NFTABI,
    functionName: 'tokenCost'
  })

  const { data: totalSupply } = useContractRead({
    address: nftContract,
    abi: NFTABI,
    functionName: 'totalSupply'
  })

  const { data: cost } = useContractRead({
    address: nftContract,
    abi: NFTABI,
    functionName: 'cost'
  })

  const tCost = (parseInt(tokenCost)/1E18).toFixed(3)
  const eCost = (parseInt(cost)/1E18).toFixed(3)

  const balance = (parseInt(tokenBal)/1E18).toFixed(3)

  const sup = (parseInt(totalSupply))


  return (
    <div className="bg-[#14181d] min-h-screen flex space-y-10 flex-col">
      <Head>
        <title>NFT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <div className="flex mt-6 justify-center">
        {" "}
        <img
            className="object-cover border-2 rounded-full w-80"
            src="https://images.hive.blog/DQmfNFedvZ7yx9mAmUzx3G4ycYemqHUHekEJwYF9o6XZhU2/hashlips%20logo.png"
            alt="image"
          />
      </div>
      <div className="text-2xl font-bold items-center text-white mt-4 text-center">NFT Minting Dapp</div>
      <div className="flex mt-20 flex-col md:flex-row text-center items-center justify-center py-2">
        <div>
          <img
          className="object-cover border-2 rounded-full w-40 md:w-40"
          src="/logo.png"
          alt="image"
        />
        </div>
        <div>
          <div className="p-4 m-3 mt-5 bg-white rounded-lg border border-t-gray-100 shadow-2xl flex items-center flex-col justify-center">
            <div>
              <div className="pl-2 flex flex-col text-center min-w-[200px] min-h-[300px] md:min-w-[400px] md:min-h-[350px]">
                <h2 className="text-[35px] font-bold tracking-tight mt-4 text-blue-600">
                  {sup}/ 1500
                </h2>
                <a href={`https://goerli.etherscan.io/address/${nftContract}` }target='_blank'><h4 className="text-lg font-semibold tracking-tight mt-6 text-blue-600">
                  {truncateEthAddress(nftContract)}
                </h4></a>
                <p className="mb-2 text-md leading-normal mt-8">
                  1 NFT costs {eCost} ETH or {tCost} TOKENS
                </p>
                <p className="mb-2 text-md leading-normal mt-2">
                  Excluding gas fees.
                </p>
                <div className="flex text-center items-center justify-center flex-row mt-10 space-x-2">
                  <button onClick={() => setShowEthModal(true)} className="px-4 py-2 text-sm text-blue-100 hover:bg-blue-600 bg-blue-500 rounded shadow">
                    Mint with ETH
                  </button>
                  <button onClick={() => setShowTokenModal(true)}  className="px-4 py-2 text-sm text-blue-100 hover:bg-blue-600 bg-blue-500 rounded shadow">
                    Mint with Tokens
                  </button>
                  <Modal show={showTokenModal} isToken={true} setShow={setShowTokenModal} />
                  <Modal show={showEthModal} isToken={false} setShow={setShowEthModal} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
        <img
          className="object-cover border-2 rounded-full w-40 md:w-40"
          src="/logo.png"
          alt="image"
        />
        </div>
      </div>
    </div>
  );
};

export default Home;
