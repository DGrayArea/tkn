import React, { useContext, useEffect } from "react";
import UserContext from "../components/UserContext";
import Home1 from "./home/home_8";

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

export default function Home() {
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
  //End of TKN
  
  const { scrollRef } = useContext(UserContext);

  useEffect(() => {
    window.scrollTo(0, scrollRef.current.scrollPos);
    const handleScrollPos = () => {
      scrollRef.current.scrollPos = window.scrollY;
    };
    window.addEventListener("scroll", handleScrollPos);
    return () => {
      window.removeEventListener("scroll", handleScrollPos);
    };
  });

  return (
    <>
      <Home1 />
    </>
  );
}
