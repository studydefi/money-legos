import oneSplitAbi from "./abi/OneSplit.json";

import networks from "../networks";

const contracts = {
  address: {
    [networks.mainnet]: "0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E", // Alternatively 1split.eth
  },
  abi: oneSplitAbi,
};

export default contracts;
