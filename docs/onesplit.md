# OneSplit

## Swapping Tokens

__Note__: As 1split is dependent on a variaty of on-chain DEX's, occasionally token transfers might fail, even with the right parameters. If you would like a more stable and consistent way of swapping tokens, consider using [Uniswap](/uniswap) or Curve.fi for stablecoins.

```javascript
const { ethers } = require("ethers");
const { getLegosFor, networks } = require("@studydefi/money-legos");

const legos = getLegosFor(networks.mainnet);

const provider = new ethers.providers.JsonRpcProvider(
  process.env.PROVIDER_URL || "http://localhost:8545"
);

const wallet = new ethers.Wallet(
  "0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773", // Default private key for ganache-cli -d
  provider
);

const newTokenContract = (address) =>
  new ethers.Contract(address, legos.erc20.contracts.abi, wallet);

const oneSplitContract = new ethers.Contract(
  legos.onesplit.contracts.address,
  legos.onesplit.contracts.abi,
  wallet
);

const swapOnOneSplit = async (
  fromAddress,
  toAddress,
  amountWei,
  distribution = 10,
  disableFlags = 0
) => {
  // Calculate distribution
  const expectedReturns = await oneSplitContract.getExpectedReturn(
    fromAddress,
    toAddress,
    amountWei,
    distribution,
    disableFlags
  );

  // ETH -> Token
  if (fromAddress === legos.erc20.contracts.eth.address) {
    await oneSplitContract.swap(
      fromAddress,
      toAddress,
      amountWei,
      1,
      expectedReturns.distribution,
      disableFlags,
      {
        gasLimit: 4000000,
        value: ethers.utils.parseEther("1"),
      }
    );
    return;
  }

  // Need to approve 1inch to swap
  await newTokenContract(fromAddress).approve(
    legos.onesplit.contracts.address,
    amountWei
  );

  await oneSplitContract.swap(
    fromAddress,
    toAddress,
    amountWei,
    1,
    expectedReturns.distribution,
    disableFlags
  );
};

const swapAndLog = async (fromToken, toToken, amount) => {
  console.log(`Swapping ${amount} ${fromToken.symbol} to ${toToken.symbol}`);

  await swapOnOneSplit(
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
  await swapAndLog(legos.erc20.contracts.eth, legos.erc20.contracts.dai, 1);
  await swapAndLog(legos.erc20.contracts.dai, legos.erc20.contracts.eth, 100);
  await swapAndLog(legos.erc20.contracts.eth, legos.erc20.contracts.dai, 1);
  await swapAndLog(legos.erc20.contracts.dai, legos.erc20.contracts.zrx, 100);
};

main();
```