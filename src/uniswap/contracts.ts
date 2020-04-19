import exchangeAbi from "./abi/Exchange.json";
import factoryAbi from "./abi/Factory.json";

const contracts = {
  factory: {
    address: "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95",
    abi: factoryAbi,
  },
  exchange: {
    abi: exchangeAbi,
  },
};

export default contracts;
