# Kyber.Network

Check out the [docs](https://developer.kyber.network/) for more info.

## Interface

### KyberNetworkProxy

```js
// ../src/kyber/contracts/KyberNetworkProxy.sol

pragma solidity ^0.5.0;

// Note: Kyber uses it owns ERC20 interface
// See: https://github.com/KyberNetwork/smart-contracts/blob/master/contracts/ERC20Interface.sol
import { IERC20 as ERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface KyberNetworkProxyInterface {
    function maxGasPrice() external view returns(uint);
    function getUserCapInWei(address user) external view returns(uint);
    function getUserCapInTokenWei(address user, ERC20 token) external view returns(uint);
    function enabled() external view returns(bool);
    function info(bytes32 id) external view returns(uint);

    function getExpectedRate(ERC20 src, ERC20 dest, uint srcQty) external view
        returns (uint expectedRate, uint slippageRate);

    function tradeWithHint(ERC20 src, uint srcAmount, ERC20 dest, address destAddress, uint maxDestAmount,
        uint minConversionRate, address walletId, bytes calldata hint) external payable returns(uint);
}

interface SimpleNetworkInterface {
    function swapTokenToToken(ERC20 src, uint srcAmount, ERC20 dest, uint minConversionRate) external returns(uint);
    function swapEtherToToken(ERC20 token, uint minConversionRate) external payable returns(uint);
    function swapTokenToEther(ERC20 token, uint srcAmount, uint minConversionRate) external returns(uint);
}

contract KyberNetworkProxy is KyberNetworkProxyInterface, SimpleNetworkInterface {}
```

## Examples

### JavaScript

```js
const { ethers } = require("ethers");
const erc20 = require("@studydefi/money-legos/erc20");
const kyber = require("@studydefi/money-legos/kyber");

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
    kyber.network.address,
    kyber.network.abi,
    wallet,
  );

  // ERC20 contract
  const fromTokenContract = new ethers.Contract(fromAddress, erc20.abi, wallet);

  // ETH -> Token
  if (fromAddress === erc20.eth.address) {
    return kyberNetwork.swapEtherToToken(toAddress, minConversionRate, {
      gasLimit,
      value: fromAmountWei,
    });
  }

  // Need to approve transferFrom
  await fromTokenContract.approve(kyberNetwork.address, fromAmountWei);

  // Token -> ETH
  if (toAddress === erc20.eth.address) {
    return kyberNetwork.swapTokenToEther(
      fromAddress,
      fromAmountWei,
      minConversionRate,
      {
        gasLimit,
      },
    );
  }

  // Token -> Token
  return kyberNetwork.swapTokenToToken(
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

  if (toToken === erc20.eth) {
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
  await swapAndLog(erc20.eth, erc20.dai, 1);
  await swapAndLog(erc20.dai, erc20.rep, 50);
  await swapAndLog(erc20.rep, erc20.eth, 2);
};

main();
```

### Solidity

```js
// ../tests/kyber.test.sol

pragma solidity ^0.5.0;

import "@studydefi/money-legos/kyber/contracts/KyberNetworkProxy.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract KyberLiteBase {
    // KyberNetwork Mainnet factory address
    address constant KyberNetworkProxyAddress = 0x818E6FECD516Ecc3849DAf6845e3EC868087B755;

    function _ethToToken(address tokenAddress, uint ethAmount) internal returns (uint) {
        return _ethToToken(tokenAddress, ethAmount, uint(1));
    }

    function _ethToToken(address tokenAddress, uint ethAmount, uint minConversionRate) internal returns (uint) {
        IERC20 token = IERC20(tokenAddress);
        return KyberNetworkProxy(KyberNetworkProxyAddress).swapEtherToToken.value(ethAmount)(token, minConversionRate);
    }

    function _tokenToEth(address tokenAddress, uint tokenAmount) internal returns (uint) {
        return _tokenToEth(tokenAddress, tokenAmount, uint(1));
    }

    function _tokenToEth(address tokenAddress, uint tokenAmount, uint minConversionRate) internal returns (uint) {
        KyberNetworkProxy kyber = KyberNetworkProxy(KyberNetworkProxyAddress);

        IERC20 token = IERC20(tokenAddress);

        token.approve(address(kyber), tokenAmount);

        return kyber.swapTokenToEther(token, tokenAmount, minConversionRate);
    }

    function _tokenToToken(address from, address to, uint tokenAmount, uint minConversionRate) internal returns (uint) {
        KyberNetworkProxy kyber = KyberNetworkProxy(KyberNetworkProxyAddress);

        IERC20(from).approve(address(kyber), tokenAmount);

        return kyber.swapTokenToToken(IERC20(from), tokenAmount, IERC20(to), minConversionRate);
    }

    function _tokenToToken(address from, address to, uint tokenAmount) internal returns (uint) {
        return _tokenToToken(from, to, tokenAmount, uint(1));
    }

    function ethToToken(address tokenAddress) public payable {
        IERC20 token = IERC20(tokenAddress);
        uint256 tokensAmount = _ethToToken(tokenAddress, msg.value, uint(1));
        token.transfer(msg.sender, tokensAmount);
    }
}
```
