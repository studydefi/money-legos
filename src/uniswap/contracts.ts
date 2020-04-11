import exchangeAbi from "./abi/Exchange.json";
import factoryAbi from "./abi/Factory.json";

import networks from "../networks";

const contracts = {
  factory: {
    address: {
      [networks.mainnet]: "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95",
    },
    abi: factoryAbi,
  },
  exchange: {
    abi: exchangeAbi,
  },
};

export default contracts;
