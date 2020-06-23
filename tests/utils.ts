import { ethers } from "ethers";
import { BigNumber } from "ethers/utils";

export const fromWei = (x: BigNumber, u = 18) => ethers.utils.formatUnits(x, u);

export const mineBlock = async (provider: any, timestamp: number) =>
  await provider.send("evm_mine", [timestamp]);

export const increaseTime = async (provider: any, secsToIncrease: number) => {
  const blockNumber = await provider.getBlockNumber();
  const { timestamp: currentTimestamp } = await provider.getBlock(blockNumber);
  const newTime = Number(currentTimestamp) + Number(secsToIncrease);
  await mineBlock(provider, newTime);
};
