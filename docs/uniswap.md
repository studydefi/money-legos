# Uniswap (V1)

## Interface

### Factory
```javascript
pragma solidity ^0.5.0;

interface IUniswapFactory {
    // Public Variables
    address public exchangeTemplate;
    uint256 public tokenCount;
    // Create Exchange
    function createExchange(address token) external returns (address exchange);
    // Get Exchange and Token Info
    function getExchange(address token) external view returns (address exchange);
    function getToken(address exchange) external view returns (address token);
    function getTokenWithId(uint256 tokenId) external view returns (address token);
    // Never use
    function initializeFactory(address template) external;
}
```

### Exchange
```javascript
pragma solidity ^0.5.0;

interface UniswapExchangeInterface {
    // Address of ERC20 token sold on this exchange
    function tokenAddress() external view returns (address token);
    // Address of Uniswap Factory
    function factoryAddress() external view returns (address factory);
    // Provide Liquidity
    function addLiquidity(uint256 min_liquidity, uint256 max_tokens, uint256 deadline) external payable returns (uint256);
    function removeLiquidity(uint256 amount, uint256 min_eth, uint256 min_tokens, uint256 deadline) external returns (uint256, uint256);
    // Get Prices
    function getEthToTokenInputPrice(uint256 eth_sold) external view returns (uint256 tokens_bought);
    function getEthToTokenOutputPrice(uint256 tokens_bought) external view returns (uint256 eth_sold);
    function getTokenToEthInputPrice(uint256 tokens_sold) external view returns (uint256 eth_bought);
    function getTokenToEthOutputPrice(uint256 eth_bought) external view returns (uint256 tokens_sold);
    // Trade ETH to ERC20
    function ethToTokenSwapInput(uint256 min_tokens, uint256 deadline) external payable returns (uint256 tokens_bought);
    function ethToTokenTransferInput(uint256 min_tokens, uint256 deadline, address recipient) external payable returns (uint256  tokens_bought);
    function ethToTokenSwapOutput(uint256 tokens_bought, uint256 deadline) external payable returns (uint256  eth_sold);
    function ethToTokenTransferOutput(uint256 tokens_bought, uint256 deadline, address recipient) external payable returns (uint256  eth_sold);
    // Trade ERC20 to ETH
    function tokenToEthSwapInput(uint256 tokens_sold, uint256 min_eth, uint256 deadline) external returns (uint256  eth_bought);
    function tokenToEthTransferInput(uint256 tokens_sold, uint256 min_eth, uint256 deadline, address recipient) external returns (uint256  eth_bought);
    function tokenToEthSwapOutput(uint256 eth_bought, uint256 max_tokens, uint256 deadline) external returns (uint256  tokens_sold);
    function tokenToEthTransferOutput(uint256 eth_bought, uint256 max_tokens, uint256 deadline, address recipient) external returns (uint256  tokens_sold);
    // Trade ERC20 to ERC20
    function tokenToTokenSwapInput(uint256 tokens_sold, uint256 min_tokens_bought, uint256 min_eth_bought, uint256 deadline, address token_addr) external returns (uint256  tokens_bought);
    function tokenToTokenTransferInput(uint256 tokens_sold, uint256 min_tokens_bought, uint256 min_eth_bought, uint256 deadline, address recipient, address token_addr) external returns (uint256  tokens_bought);
    function tokenToTokenSwapOutput(uint256 tokens_bought, uint256 max_tokens_sold, uint256 max_eth_sold, uint256 deadline, address token_addr) external returns (uint256  tokens_sold);
    function tokenToTokenTransferOutput(uint256 tokens_bought, uint256 max_tokens_sold, uint256 max_eth_sold, uint256 deadline, address recipient, address token_addr) external returns (uint256  tokens_sold);
    // Trade ERC20 to Custom Pool
    function tokenToExchangeSwapInput(uint256 tokens_sold, uint256 min_tokens_bought, uint256 min_eth_bought, uint256 deadline, address exchange_addr) external returns (uint256  tokens_bought);
    function tokenToExchangeTransferInput(uint256 tokens_sold, uint256 min_tokens_bought, uint256 min_eth_bought, uint256 deadline, address recipient, address exchange_addr) external returns (uint256  tokens_bought);
    function tokenToExchangeSwapOutput(uint256 tokens_bought, uint256 max_tokens_sold, uint256 max_eth_sold, uint256 deadline, address exchange_addr) external returns (uint256  tokens_sold);
    function tokenToExchangeTransferOutput(uint256 tokens_bought, uint256 max_tokens_sold, uint256 max_eth_sold, uint256 deadline, address recipient, address exchange_addr) external returns (uint256  tokens_sold);
    // ERC20 comaptibility for liquidity tokens
    bytes32 public name;
    bytes32 public symbol;
    uint256 public decimals;
    function transfer(address _to, uint256 _value) external returns (bool);
    function transferFrom(address _from, address _to, uint256 value) external returns (bool);
    function approve(address _spender, uint256 _value) external returns (bool);
    function allowance(address _owner, address _spender) external view returns (uint256);
    function balanceOf(address _owner) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    // Never use
    function setup(address token_addr) external;
}
```

## Examples

### JavaScript

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

### Solidity
```javascript
pragma solidity ^0.5.0;

import "@studydefi/money-legos/src/uniswap/interface/IUniswapExchange.sol";
import "@studydefi/money-legos/src/uniswap/interface/IUniswapExchange.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UniswapLiteBase {
    // Uniswap Mainnet factory address
    address constant UniswapFactoryAddress = 0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95;

    function _getUniswapExchange(address tokenAddress) internal view returns (address) {
        return IUniswapFactory(UniswapFactoryAddress).getExchange(tokenAddress);
    }

    function _ethToToken(address tokenAddress, uint ethAmount)
        internal returns (uint) {
        return _ethToToken(tokenAddress, ethAmount, uint(1));
    }

    function _ethToToken(address tokenAddress, uint ethAmount, uint minTokenAmount)
        internal returns (uint) {
        return IUniswapExchange(_getUniswapExchange(tokenAddress))
            .ethToTokenSwapInput.value(ethAmount)(minTokenAmount, uint(now + 60));
    }

    function _tokenToEth(address tokenAddress, uint tokenAmount) internal returns (uint) {
        return _tokenToEth(tokenAddress, tokenAmount, uint(1));
    }

    function _tokenToEth(address tokenAddress, uint tokenAmount, uint minEthAmount) internal returns (uint) {
        address exchange = _getUniswapExchange(tokenAddress);

        IERC20(tokenAddress).approve(exchange, tokenAmount);

        return IUniswapExchange(exchange)
            .tokenToEthSwapInput(tokenAmount, minEthAmount, uint(now + 60));
    }

    function _tokenToToken(address from, address to, uint tokenInAmount, uint minTokenOut) internal returns (uint) {
        uint ethAmount = _tokenToEth(from, tokenInAmount);
        return _ethToToken(to, ethAmount, minTokenOut);
    }

    function _tokenToToken(address from, address to, uint tokenAmount) internal returns (uint) {
        return _tokenToToken(from, to, tokenAmount, uint(1));
    }

    function _getTokenToEthInput(address tokenAddress, uint tokenAmount) internal view returns (uint) {
        return IUniswapExchange(_getUniswapExchange(tokenAddress)).getTokenToEthInputPrice(tokenAmount);
    }

    function _getEthToTokenInput(address tokenAddress, uint ethAmount) internal view returns (uint) {
        return IUniswapExchange(_getUniswapExchange(tokenAddress)).getEthToTokenInputPrice(ethAmount);
    }

    function _getTokenToEthOutput(address tokenAddress, uint ethAmount) internal view returns (uint) {
        return IUniswapExchange(_getUniswapExchange(tokenAddress)).getTokenToEthOutputPrice(ethAmount);
    }

    function _getEthToTokenOutput(address tokenAddress, uint tokenAmount) internal view returns (uint) {
        return IUniswapExchange(_getUniswapExchange(tokenAddress)).getEthToTokenOutputPrice(tokenAmount);
    }

    function _getTokenToTokenInput(address from, address to, uint fromAmount) internal view returns (uint) {
        uint ethAmount = _getTokenToEthInput(from, fromAmount);
        return _getEthToTokenInput(to, ethAmount);
    }
}
```