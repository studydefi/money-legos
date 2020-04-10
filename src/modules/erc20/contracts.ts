import ERC20Abi from "./abi/ERC20.json";

import {networks} from "../../networks";

const contracts = {
  abi: ERC20Abi,
  bat: {
    address: {
      [networks.mainnet]: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
    },
  },
  dai: {
    address: {
      [networks.mainnet]: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
  },
  rep: {
    address: {
      [networks.mainnet]: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
    },
  },
  sai: {
    address: {
      [networks.mainnet]: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
    },
  },
  usdc: {
    address: {
      [networks.mainnet]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
  },
  wbtc: {
    address: {
      [networks.mainnet]: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    },
  },
  zrx: {
    address: {
      [networks.mainnet]: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
    },
  },
};

export default contracts;
