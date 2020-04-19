import { ethers } from "ethers";
import { BigNumber } from "ethers/utils";

export const fromWei = (x: BigNumber, u = 18) => ethers.utils.formatUnits(x, u);
