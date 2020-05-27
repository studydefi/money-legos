import { default as contracts } from "./contracts";
import abi from "./abi/IdleTokenV3.json";

export default {
  ...contracts,
  abi,
  decimals: 18,
};
