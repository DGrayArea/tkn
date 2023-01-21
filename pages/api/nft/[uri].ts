// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { nftContract, provider } from "../../../config/config";
import NFTABI from "../../../config/NFTABI.json";

type Data = {
  name: string;
};

type id = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { uri } : id = req.query;
  const vider = new ethers.providers.JsonRpcProvider(provider)
  const contract = new ethers.Contract(nftContract, NFTABI, vider)

  const link = await contract.tokenURI(uri)
  res.status(200).json(link);
}
