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
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
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
  usdt: {
    symbol: "USDt",
    decimals: 6,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    abi: ERC20Abi,
  },
  link: {
    symbol: "LINK",
    decimals: 18,
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    abi: ERC20Abi,
  },
  uni: {
    symbol: "UNI",
    decimals: 18,
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    abi: ERC20Abi,
  },
  comp: {
    symbol: "COMP",
    decimals: 18,
    address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
    abi: ERC20Abi,
  },
  mkr: {
    symbol: "MKR",
    decimals: 18,
    address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
    abi: ERC20Abi,
  },
  omg: {
    symbol: "OMG",
    decimals: 18,
    address: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
    abi: ERC20Abi,
  },
  pax: {
    symbol: "PAX",
    decimals: 18,
    address: "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
    abi: ERC20Abi,
  },
  ocean: {
    symbol: "OCEAN",
    decimals: 18,
    address: "0x967da4048cD07aB37855c090aAF366e4ce1b9F48",
    abi: ERC20Abi,
  },
  bnt: {
    symbol: "BNT",
    decimals: 18,
    address: "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
    abi: ERC20Abi,
  },
};

export default tokens;
