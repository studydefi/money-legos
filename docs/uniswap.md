# Uniswap (V1)

## Swapping Tokens

```javascript
const { ethers } = require("ethers");
const { getLegosFor, networks } = require("../money-legos/dist");

const legos = getLegosFor(networks.mainnet);

const provider = new ethers.providers.JsonRpcProvider(
  process.env.PROVIDER_URL || "http://localhost:8545"
);

const wallet = new ethers.Wallet(
  "0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773", // Default private key for ganache-cli -d
  provider
);

const newExchangeContract = (address) =>
  new ethers.Contract(address, legos.uniswap.contracts.exchange.abi, wallet);

const newTokenContract = (address) =>
  new ethers.Contract(address, legos.erc20.contracts.abi, wallet);

const uniswapFactory = new ethers.Contract(
  legos.uniswap.contracts.factory.address,
  legos.uniswap.contracts.factory.abi,
  wallet
);

const swapOnUniswap = async (fromAddress, toAddress, fromAmountWei) => {
  // Don't swap
  if (fromAddress === toAddress) {
    return fromAmountWei;
  }

  // Min value of tokens to receive
  const minTokensReceived = 1;
  const minEthReceived = 1;

  // Random time in 2050
  const deadline = 2525644800;

  const toExchangeAddress = await uniswapFactory.getExchange(toAddress);
  const toExchangeContract = newExchangeContract(toExchangeAddress);

  // ETH -> Token
  if (fromAddress === legos.erc20.contracts.eth.address) {
    return toExchangeContract.ethToTokenSwapInput(minTokensReceived, deadline, {
      gasLimit: 4000000,
      value: fromAmountWei,
    });
  }

  // ERC20 contract
  const fromTokenContract = newTokenContract(fromAddress);

  // Uniswap Exchange contract
  const fromExchangeAddress = await uniswapFactory.getExchange(fromAddress);
  const fromExchangeContract = newExchangeContract(fromExchangeAddress);

  // Need to approve transferFrom
  await fromTokenContract.approve(fromExchangeAddress, fromAmountWei);

  // Token -> ETH
  if (toAddress === legos.erc20.contracts.eth.address) {
    return fromExchangeContract.tokenToEthSwapInput(fromAmountWei, 1, deadline);
  }

  // Token -> Token
  return fromExchangeContract.tokenToTokenSwapInput(
    fromAmountWei,
    minTokensReceived,
    minEthReceived,
    deadline,
    toAddress,
    {
      gasLimit: 4000000,
    }
  );
};

const swapAndLog = async (fromToken, toToken, amount) => {
  console.log(`Swapping ${amount} ${fromToken.symbol} to ${toToken.symbol}`);

  await swapOnUniswap(
    fromToken.address,
    toToken.address,
    ethers.utils.parseUnits(amount.toString(), fromToken.decimals)
  );

  if (toToken === legos.erc20.contracts.eth) {
    const ethBalWei = await wallet.getBalance();
    console.log(
      `${toToken.symbol} balance: ${ethers.utils.formatEther(ethBalWei)}`
    );
    return;
  }

  const repBal = await newTokenContract(toToken.address).balanceOf(
    wallet.address
  );
  console.log(
    `New ${toToken.symbol} balance: ${ethers.utils.formatUnits(
      repBal,
      toToken.decimals
    )}`
  );
};

const main = async () => {
  await swapAndLog(legos.erc20.contracts.rep, legos.erc20.contracts.dai, 1);
  await swapAndLog(legos.erc20.contracts.eth, legos.erc20.contracts.rep, 1);
  await swapAndLog(legos.erc20.contracts.rep, legos.erc20.contracts.eth, 1);
};

main();
```