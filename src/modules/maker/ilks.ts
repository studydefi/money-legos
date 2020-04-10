import erc20 from "../erc20";
import networks from "../../networks";

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
      address: {
        [networks.mainnet]: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      },
    },
    join: {
      address: {
        [networks.mainnet]: "0x2F0b23f53734252Bda2277357e97e1517d6B042A",
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
