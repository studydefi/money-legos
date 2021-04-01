# Balancer

Balancer is a n-dimensional automated market-maker built on Ethereum. It allows anyone to create or add liquidity to customizable pools and earn trading fees.

## Interface

### BFactory

```js
// ../src/balancer/contracts/BFactory.sol

pragma solidity ^0.5.0;

import "./BPool.sol";

interface BFactory {

    function isBPool(address b) external view returns (bool);
    function newBPool() external returns (BPool);
    
}
```

### BPool

```js
// ../src/balancer/contracts/BPool.sol

pragma solidity ^0.5.0;

interface BPool {

    function isexternalSwap() external view returns (bool);
    function isFinalized() external view returns (bool);
    function isBound(address t) external view returns (bool);
    function getNumTokens() external view returns (uint);
    function getCurrentTokens() external view returns (address[] memory tokens);
    function getFinalTokens() external view returns (address[] memory tokens);
    function getDenormalizedWeight(address token) external view returns (uint);
    function getTotalDenormalizedWeight() external view returns (uint);
    function getNormalizedWeight(address token) external view returns (uint);
    function getBalance(address token) external view returns (uint);
    function getSwapFee() external view returns (uint);
    function getController() external view returns (address);
    
    function setSwapFee(uint swapFee) external;
    function setController(address manager) external;
    function setexternalSwap(bool external_) external;
    function finalize() external;
    function bind(address token, uint balance, uint denorm) external;
    function rebind(address token, uint balance, uint denorm) external;
    function unbind(address token) external;
    function gulp(address token) external;

    function getSpotPrice(address tokenIn, address tokenOut) external view returns (uint spotPrice);
    function getSpotPriceSansFee(address tokenIn, address tokenOut) external view returns (uint spotPrice);

    function joinPool(uint poolAmountOut, uint[] calldata maxAmountsIn) external;   
    function exitPool(uint poolAmountIn, uint[] calldata minAmountsOut) external;

    function swapExactAmountIn(
        address tokenIn,
        uint tokenAmountIn,
        address tokenOut,
        uint minAmountOut,
        uint maxPrice
    ) external returns (uint tokenAmountOut, uint spotPriceAfter);
    
    function swapExactAmountOut(
        address tokenIn,
        uint maxAmountIn,
        address tokenOut,
        uint tokenAmountOut,
        uint maxPrice
    ) external returns (uint tokenAmountIn, uint spotPriceAfter);

    function joinswapExternAmountIn(
        address tokenIn,
        uint tokenAmountIn,
        uint minPoolAmountOut
    ) external returns (uint poolAmountOut);

    function joinswapPoolAmountOut(
        address tokenIn,
        uint poolAmountOut,
        uint maxAmountIn
    ) external returns (uint tokenAmountIn);
    
    function exitswapPoolAmountIn(
        address tokenOut,
        uint poolAmountIn,
        uint minAmountOut
    ) external returns (uint tokenAmountOut);

    function exitswapExternAmountOut(
        address tokenOut,
        uint tokenAmountOut,
        uint maxPoolAmountIn
    ) external returns (uint poolAmountIn);
    
    function totalSupply() external view returns (uint);
    function balanceOf(address whom) external view returns (uint);
    function allowance(address src, address dst) external view returns (uint);

    function approve(address dst, uint amt) external returns (bool);
    function transfer(address dst, uint amt) external returns (bool);
    function transferFrom(
        address src, address dst, uint amt
    ) external returns (bool);
    
    function calcSpotPrice(
        uint tokenBalanceIn,
        uint tokenWeightIn,
        uint tokenBalanceOut,
        uint tokenWeightOut,
        uint swapFee
    ) external pure returns (uint spotPrice);
    
    function calcOutGivenIn(
        uint tokenBalanceIn,
        uint tokenWeightIn,
        uint tokenBalanceOut,
        uint tokenWeightOut,
        uint tokenAmountIn,
        uint swapFee
    ) external pure returns (uint tokenAmountOut);
    
    function calcInGivenOut(
        uint tokenBalanceIn,
        uint tokenWeightIn,
        uint tokenBalanceOut,
        uint tokenWeightOut,
        uint tokenAmountOut,
        uint swapFee
    ) external pure returns (uint tokenAmountIn);
    
    function calcPoolOutGivenSingleIn(
        uint tokenBalanceIn,
        uint tokenWeightIn,
        uint poolSupply,
        uint totalWeight,
        uint tokenAmountIn,
        uint swapFee
    ) external pure returns (uint poolAmountOut);
    
    function calcSingleInGivenPoolOut(
        uint tokenBalanceIn,
        uint tokenWeightIn,
        uint poolSupply,
        uint totalWeight,
        uint poolAmountOut,
        uint swapFee
    ) external pure returns (uint tokenAmountIn);
    
    function calcSingleOutGivenPoolIn(
        uint tokenBalanceOut,
        uint tokenWeightOut,
        uint poolSupply,
        uint totalWeight,
        uint poolAmountIn,
        uint swapFee
    ) external pure returns (uint tokenAmountOut);
    
    function calcPoolInGivenSingleOut(
        uint tokenBalanceOut,
        uint tokenWeightOut,
        uint poolSupply,
        uint totalWeight,
        uint tokenAmountOut,
        uint swapFee
    ) external pure returns (uint poolAmountIn);

}
```

### ExchangeProxy

```js
// ../src/balancer/contracts/ExchangeProxy.sol

pragma solidity ^0.5.0;


interface ExchangeProxy {

    function batchSwapExactIn(
        Swap[] memory swaps,
        address tokenIn,
        address tokenOut,
        uint totalAmountIn,
        uint minTotalAmountOut
    ) public returns (uint totalAmountOut);
    
    function batchSwapExactOut(
        Swap[] memory swaps,
        address tokenIn,
        address tokenOut,
        uint maxTotalAmountIn
    ) public returns (uint totalAmountIn);
    
    function batchEthInSwapExactIn(
        Swap[] memory swaps,
        address tokenOut,
        uint minTotalAmountOut
    ) public payable returns (uint totalAmountOut);
    
    function batchEthOutSwapExactIn(
        Swap[] memory swaps,
        address tokenIn,
        uint totalAmountIn,
        uint minTotalAmountOut
    ) public returns (uint totalAmountOut);
    
    function batchEthInSwapExactOut(
        Swap[] memory swaps,
        address tokenOut
    ) public payable returns (uint totalAmountIn);
    
    function batchEthOutSwapExactOut(
        Swap[] memory swaps,
        address tokenIn,
        uint maxTotalAmountIn
    ) public returns (uint totalAmountIn);
    
}
```

## Examples (JavaScript)

### Swap ETH -> mUSD

```js
// ../tests/balancer.test.ts#L46-L80

test("Swap ETH -> mUSD", async () => {
  // given
  const beforeWei = await mUSD.balanceOf(wallet.address);
  const before = parseFloat(fromWei(beforeWei));
  expect(before).toEqual(0);

  // when
  const tokenInParam = parseEther("10");
  const tokenOutParam = 0;
  const maxPrice = MAX_UINT256;
  const swap = [
    ETH_MUSD_50_50_POOL_ADDRESS,
    tokenInParam,
    tokenOutParam,
    maxPrice,
  ];
  const swaps: any = [swap];

  const tokenOut = mUSD.address;
  const minTotalAmountOut = 1;
  await exchangeProxy.batchEthInSwapExactIn(
    swaps,
    tokenOut,
    minTotalAmountOut,
    {
      gasLimit: 500000,
      value: tokenInParam,
    },
  );

  // then
  const afterWei = await mUSD.balanceOf(wallet.address);
  const after = parseFloat(fromWei(afterWei));
  expect(after).toBeGreaterThan(0);
});
```

### Swap some mUSD -> USDC

```js
// ../tests/balancer.test.ts#L82-L122

test("Swap some mUSD -> USDC", async () => {
  // given
  const beforeWei = await usdc.balanceOf(wallet.address);
  const before = parseFloat(fromWei(beforeWei));
  expect(before).toEqual(0);

  const mUSDToSell = parseEther("1000");
  await mUSD.approve(exchangeProxy.address, mUSDToSell);

  // when
  const tokenInParam = mUSDToSell;
  const tokenOutParam = 0;
  const maxPrice = MAX_UINT256;
  const swap = [
    MUSD_USDC_50_50_POOL_ADDRESS,
    tokenInParam,
    tokenOutParam,
    maxPrice,
  ];
  const swaps: any = [swap];

  const tokenIn = mUSD.addressPromise;
  const tokenOut = usdc.address;
  const totalAmountIn = mUSDToSell;
  const minTotalAmountOut = 1;
  await exchangeProxy.batchSwapExactIn(
    swaps,
    tokenIn,
    tokenOut,
    totalAmountIn,
    minTotalAmountOut,
    {
      gasLimit: 500000,
    },
  );

  // then
  const afterWei = await usdc.balanceOf(wallet.address);
  const after = parseFloat(fromWei(afterWei));
  expect(after).toBeGreaterThan(0);
});
```

### Add liquidity to a pool

```js
// ../tests/balancer.test.ts#L124-L149

test("Add liquidity to a pool", async () => {
  const pool = new ethers.Contract(
    MUSD_USDC_50_50_POOL_ADDRESS,
    balancer.BPool.abi,
    wallet,
  );

  // given
  const beforeWei = await pool.balanceOf(wallet.address);
  const before = parseFloat(fromWei(beforeWei));
  expect(before).toEqual(0);

  await mUSD.approve(pool.address, MAX_UINT256);
  await usdc.approve(pool.address, MAX_UINT256);

  const poolAmountOut = parseEther("5");
  const maxAmountsIn = [
    parseUnits("1000", mstable.mUSD.decimals),
    parseUnits("1000", erc20.usdc.decimals),
  ];
  await pool.joinPool(poolAmountOut, maxAmountsIn, { gasLimit: 500000 });

  const afterWei = await pool.balanceOf(wallet.address);
  const after = parseFloat(fromWei(afterWei));
  expect(after).toEqual(parseFloat(fromWei(poolAmountOut)));
});
```
