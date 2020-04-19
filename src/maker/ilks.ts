import erc20 from "../erc20";

const ilks = {
  batA: {
    symbol: "BAT-A",
    token: { address: erc20.contracts.bat.address },
  },
  ethA: {
    symbol: "ETH-A",
    token: { address: erc20.contracts.eth.address },
  },
  usdcA: {
    symbol: "USDC-A",
    token: { address: erc20.contracts.usdc.address },
  },
};

export default ilks;
