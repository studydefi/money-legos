import { ethers } from "ethers";
import { AsyncSendable } from "ethers/providers";
import Ganache from "ganache-core";

export const startChain = async () => {
  const ganache = Ganache.provider({
    fork: process.env.MAINNET_NODE_URL,
    network_id: 1,
    accounts: [
      {
        secretKey: process.env.PRIV_KEY,
        balance: ethers.utils.hexlify(ethers.utils.parseEther("1000")),
      },
    ],
  });

  const provider = new ethers.providers.Web3Provider(ganache as AsyncSendable);
  const wallet = new ethers.Wallet(process.env.PRIV_KEY as string, provider);

  return wallet;
};
