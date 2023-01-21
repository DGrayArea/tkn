import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import { nftStaking } from '../config/config';
import NftStakingABI from '../config/NftStakingABI.json'

const NftCard = ({ tokenId, status, index }) => {

  const { config } = usePrepareContractWrite({
    address: nftStaking,
    abi: NftStakingABI,
    functionName: 'stake',
    args: [[tokenId]]
  })
  const { data, isLoading, isSuccess, write: stake } = useContractWrite(config)

  const { config: unstakConfig } = usePrepareContractWrite({
    address: nftStaking,
    abi: NftStakingABI,
    functionName: 'withdraw',
    args: [[tokenId]]
  })
  const { data: unstk, isLoading: load, isSuccess: succ, write: unstake } = useContractWrite(unstakConfig)

  let nftId = (tokenId)
  let jsonUri = async()  => {
      const isApp = await fetch(`/api/nft/${nftId}`).then(res => res.json())
      const d = await isApp
      await fetch(d).then(res => res.json()).then(d => {
        let cleanUri = d.image.replace(
          "ipfs://",
          "https://gateway.ipfscdn.io/ipfs/"
        );
        document.getElementById((index)?.toString()).src = cleanUri
      })
  }
  jsonUri()

  return (
    <div className="border w-fit border-gray-500 p-2 rounded-lg">
      <div className="border w-[110px] border-gray-500 rounded-lg overflow-hidden shadow-lg">
        <img
          className="w-28 h-24"
          src={''}
          alt="Mountain"
          id={(index)?.toString()}
        />
        <div className="bg-black px-1 pt-1 pb-1 flex justify-around">
          <span className="inline-block bg-gray-800 rounded-lg px-1 py-1 text-xs font-semibold text-gray-400 mr-1 mb-1">
            #{tokenId}
          </span>
          {status ? (
            <span className="inline-block bg-green-900 rounded-lg px-1 py-1 text-xs font-semibold text-green-400 mr-1 mb-1">
              Staked
            </span>
          ) : (
            <span className="inline-block bg-red-900 rounded-lg px-1 py-1 text-xs font-semibold text-red-400 mr-1 mb-1">
              Unstaked
            </span>
          )}
        </div>
      </div>
      <div className="flex">
        &nbsp;
        &nbsp;
      {status ?
          <button disabled={!unstake} onClick={() => unstake?.()} className="px-4 m-2 py-2 text-sm text-blue-100 hover:bg-blue-600 bg-blue-500 rounded shadow">
            Unstake
          </button>
          :
          <button disabled={!stake} onClick={() => stake?.()} className="px-4 m-2 py-2 text-sm text-blue-100 hover:bg-blue-600 bg-blue-500 rounded shadow">
          Stake
        </button>
      }
      </div>
    </div>
  );
};

export default NftCard;

