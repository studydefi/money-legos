import factoryAbi from "./abi/IUniswapV2Factory.json";
import pairAbi from "./abi/IUniswapV2Pair.json";
import router01Abi from "./abi/IUniswapV2Router01.json";
import router02Abi from "./abi/IUniswapV2Router02.json";

const contracts = {
  factory: {
    address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    abi: factoryAbi,
  },
  pair: {
    abi: pairAbi,
  },
  router01: {
    address: "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a",
    abi: router01Abi,
  },
  router02: {
    address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    abi: router02Abi,
  },
};

export default contracts;
