import ERC20Abi from "./abi/ERC20.json";
import WETHAbi from "./abi/WETH.json";

const tokens = {
  eth: {
    symbol: "ETH",
    decimals: 18,
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  },
  bat: {
    symbol: "BAT",
    decimals: 18,
    address: "0x0d8775f648430679a709e98d2b0cb6250d2887ef",
    abi: ERC20Abi,
  },
  dai: {
    symbol: "DAI",
    decimals: 18,
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    abi: ERC20Abi,
  },
  rep: {
    symbol: "REP",
    decimals: 18,
    address: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
    abi: ERC20Abi,
  },
  sai: {
    symbol: "SAI",
    decimals: 18,
    address: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
    abi: ERC20Abi,
  },
  snx: {
    symbol: "SNX",
    decimals: 18,
    address: "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f",
    abi: ERC20Abi,
  },
  usdc: {
    symbol: "USDC",
    decimals: 6,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    abi: ERC20Abi,
  },
  weth: {
    symbol: "WETH",
    decimals: 18,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    abi: WETHAbi,
  },
  wbtc: {
    symbol: "WBTC",
    decimals: 8,
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    abi: ERC20Abi,
  },
  zrx: {
    symbol: "ZRX",
    decimals: 18,
    address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
    abi: ERC20Abi,
  },
  bal: {
    symbol: "BAL",
    decimals: 18,
    address: "0xba100000625a3754423978a60c9317c58a424e3D",
    abi: ERC20Abi,
  },
};

export default tokens;
