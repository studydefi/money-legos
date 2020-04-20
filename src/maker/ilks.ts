import erc20 from "../erc20";

const ilks = {
  batA: {
    symbol: "BAT-A",
    token: { address: erc20.bat.address },
  },
  ethA: {
    symbol: "ETH-A",
    token: { address: erc20.eth.address },
  },
  usdcA: {
    symbol: "USDC-A",
    token: { address: erc20.usdc.address },
  },
};

export default ilks;
