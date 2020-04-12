import erc20 from "../erc20";
import networks from "../networks";

const ilks = {
  batA: {
    symbol: "BAT-A",
    token: { address: erc20.contracts.bat.address },
    join: {
      address: {
        [networks.mainnet]: "0x3D0B1912B66114d4096F48A8CEe3A56C231772cA",
      },
    },
  },
  ethA: {
    symbol: "ETH-A",
    token: {
      address: { [networks.mainnet]: erc20.contracts.eth.address },
    },
    join: {
      address: {
        [networks.mainnet]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
      },
    },
  },
  usdcA: {
    symbol: "USDC-A",
    token: { address: erc20.contracts.usdc.address },
    join: {
      address: {
        [networks.mainnet]: "0xA191e578a6736167326d05c119CE0c90849E84B7",
      },
    },
  },
};

export default ilks;
