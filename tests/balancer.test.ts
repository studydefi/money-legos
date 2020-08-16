jest.setTimeout(100000);

import { Wallet, Contract, ethers } from "ethers";
import erc20 from "../src/erc20";
import balancer from "../src/balancer";
import mstable from "../src/mstable";
import { fromWei } from "./utils";
import { parseUnits } from "ethers/utils";

const { parseEther, bigNumberify } = ethers.utils;

const MAX_UINT256 = bigNumberify("2").pow("256").sub("1");

// Note:
// Balancer uses Smart Order Router (SOR), an off-chain linear optimization of routing orders across pools.
// SOR exists in the Bronze release as a way to aggregate liquidity across all Balancer pools.
// Future releases of Balancer will accomplish this on-chain and allow aggregate contract fillable liquidity.
// See more: https://docs.balancer.finance/protocol/sor
const ETH_MUSD_50_50_POOL_ADDRESS =
  "0xe036cce08cf4e23d33bc6b18e53caf532afa8513";
const MUSD_USDC_50_50_POOL_ADDRESS =
  "0x72Cd8f4504941Bf8c5a21d1Fd83A96499FD71d2C";

describe("balancer", () => {
  let wallet: Wallet;
  let weth: Contract;
  let mUSD: Contract;
  let usdc: Contract;
  let exchangeProxy: Contract;

  beforeAll(async () => {
    ethers.errors.setLogLevel("error");

    // @ts-ignore
    wallet = global.wallet;
    weth = new ethers.Contract(erc20.weth.address, erc20.weth.abi, wallet);
    mUSD = new ethers.Contract(mstable.mUSD.address, mstable.mUSD.abi, wallet);
    usdc = new ethers.Contract(erc20.usdc.address, erc20.usdc.abi, wallet);
    exchangeProxy = new ethers.Contract(
      balancer.ExchangeProxy.address,
      balancer.ExchangeProxy.abi,
      wallet,
    );
  });

  test("swap ETH -> mUSD", async () => {
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

  test("swap some mUSD -> USDC", async () => {
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
});
