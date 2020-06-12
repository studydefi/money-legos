import { ethers } from "ethers";
import { BigNumber } from "ethers/utils";

export const fromWei = (x: BigNumber, u = 18) => ethers.utils.formatUnits(x, u);

export const advanceBlock = async (provider: any) =>
  await provider.send("evm_mine", []);

export const increaseTime = async (provider: any, secsToIncrease: number) => {
  await provider.send("evm_increaseTime", [secsToIncrease]);
  await advanceBlock(provider);
};
