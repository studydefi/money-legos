import { ethers } from "ethers";
import { BigNumber } from "ethers/utils";

export const fromWei = (x: BigNumber, u = 18) => ethers.utils.formatUnits(x, u);

export const advanceBlock = async (provider: any, timestamp: number) =>
  await provider.send("evm_mine", [timestamp]);

export const increaseTime = async (provider: any, secsToIncrease: number) => {
  const bn = await provider.getBlockNumber();
  const { timestamp: currentTimestamp } = await provider.getBlock(bn);

  // await provider.send("evm_increaseTime", [secsToIncrease]);
  const newTime = Number(currentTimestamp) + Number(secsToIncrease);
  await advanceBlock(provider, newTime);
};
