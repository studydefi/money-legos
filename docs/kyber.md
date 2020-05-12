# Kyber.Network

Check out the [docs](https://uniswap.org/docs/v1) for more info.

## Interface

### KyberNetworkProxy

```js
// ../src/uniswap/contracts/IUniswapFactory.sol

pragma solidity ^0.5.0;

interface KyberNetworkProxy {
function maxGasPrice() public view returns(uint);
    function getUserCapInWei(address user) public view returns(uint);
    function getUserCapInTokenWei(address user, ERC20 token) public view returns(uint);
    function enabled() public view returns(bool);
    function info(bytes32 id) public view returns(uint);

    function getExpectedRate(ERC20 src, ERC20 dest, uint srcQty) public view
        returns (uint expectedRate, uint slippageRate);

    function tradeWithHint(ERC20 src, uint srcAmount, ERC20 dest, address destAddress, uint maxDestAmount,
        uint minConversionRate, address walletId, bytes hint) public payable returns(uint);

    function swapTokenToToken(ERC20 src, uint srcAmount, ERC20 dest, uint minConversionRate) public returns(uint);
    function swapEtherToToken(ERC20 token, uint minConversionRate) public payable returns(uint);
    function swapTokenToEther(ERC20 token, uint srcAmount, uint minConversionRate) public returns(uint);
}
```

## Examples

### JavaScript

```js
const { ethers } = require("ethers");
const { getLegosFor, networks } = require("@studydefi/money-legos");

const legos = getLegosFor(networks.mainnet);

const provider = new ethers.providers.JsonRpcProvider(
  process.env.PROVIDER_URL || "http://localhost:8545",
);

const wallet = new ethers.Wallet(
  "0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773", // Default private key for ganache-cli -d
  provider,
);

const swapOnKyber = async (fromAddress, toAddress, fromAmountWei) => {
  // Don't swap
  if (fromAddress === toAddress) {
    return fromAmountWei;
  }

  const gasLimit = 4000000;

  // Min conversion rate
  const minConversionRate = 1;

  const kyberNetwork = new ethers.Contract(
    legos.kyber.contracts.network.address,
    legos.kyber.contracts.factnetworkry.abi,
    wallet,
  );

  // ERC20 contract
  const fromTokenContract = new ethers.Contract(
    fromAddress,
    legos.erc20.contracts.abi,
    wallet,
  );

  // ETH -> Token
  if (fromAddress === legos.erc20.contracts.eth.address) {
    return kyberNetwork.swapEtherToToken(toAddress, minConversionRate, {
      gasLimit,
      value: fromAmountWei,
    });
  }

  // Need to approve transferFrom
  await fromTokenContract.approve(kyberNetwork.address, fromAmountWei);

  // Token -> ETH
  if (toAddress === legos.erc20.contracts.eth.address) {
    return fromExchangeContract.swapTokenToEther(
      fromAddress,
      fromAmountWei,
      minConversionRate,
      {
        gasLimit,
      },
    );
  }

  // Token -> Token
  return fromExchangeContract.swapTokenToToken(
    fromAddress,
    fromAmountWei,
    toAddress,
    minConversionRate,
    {
      gasLimit,
    },
  );
};

const swapAndLog = async (fromToken, toToken, amount) => {
  console.log(`Swapping ${amount} ${fromToken.symbol} to ${toToken.symbol}`);

  await swapOnKyber(
    fromToken.address,
    toToken.address,
    ethers.utils.parseUnits(amount.toString(), fromToken.decimals),
  );

  if (toToken === legos.erc20.contracts.eth) {
    const ethBalWei = await wallet.getBalance();
    console.log(
      `${toToken.symbol} balance: ${ethers.utils.formatEther(ethBalWei)}`,
    );
    return;
  }

  const repBal = await newTokenContract(toToken.address).balanceOf(
    wallet.address,
  );
  console.log(
    `New ${toToken.symbol} balance: ${ethers.utils.formatUnits(
      repBal,
      toToken.decimals,
    )}`,
  );
};

const main = async () => {
  await swapAndLog(legos.erc20.contracts.eth, legos.erc20.contracts.dai, 1);
  await swapAndLog(legos.erc20.contracts.dai, legos.erc20.contracts.rep, 50);
  await swapAndLog(legos.erc20.contracts.rep, legos.erc20.contracts.eth, 2);
};

main();
```

### Solidity

```js
pragma solidity ^0.5.0;

import "@studydefi/money-legos/kyber/contracts/KyberNetworkProxy.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract KyberLiteBase {
    // Uniswap Mainnet factory address
    address constant KyberNetworkProxyAddress = 0x818E6FECD516Ecc3849DAf6845e3EC868087B755;

    function _ethToToken(address tokenAddress, uint ethAmount)
        internal returns (uint) {
        return _ethToToken(tokenAddress, ethAmount, uint(1));
    }

    function _ethToToken(address tokenAddress, uint ethAmount, uint minConversionRate)
        internal returns (uint) {
        return KyberNetworkProxy(KyberNetworkProxyAddress)
            .swapEtherToToken.value(ethAmount)(tokenAddress, minConversionRate);
    }

    function _tokenToEth(address tokenAddress, uint tokenAmount) internal returns (uint) {
        return _tokenToEth(tokenAddress, tokenAmount, uint(1));
    }

    function _tokenToEth(address tokenAddress, uint tokenAmount, uint minConversionRate) internal returns (uint) {
        address kyber = KyberNetworkProxy(KyberNetworkProxyAddress);

        IERC20(tokenAddress).approve(exchange, tokenAmount);

        return kyber.swapTokenToEther(tokenAddress, tokenAmount, minConversionRate);
    }

    function _tokenToToken(address from, address to, uint tokenInAmount, uint minConversionRate) internal returns (uint) {
        address kyber = KyberNetworkProxy(KyberNetworkProxyAddress);

        IERC20(tokenAddress).approve(exchange, tokenAmount);

        return kyber.swapTokenToToken(from, tokenAmount, to, minConversionRate);
    }

    function _tokenToToken(address from, address to, uint tokenAmount) internal returns (uint) {
        return _tokenToToken(from, to, tokenAmount, uint(1));
    }
}
```
