jest.setTimeout(100000);

import { Wallet, Contract, ethers } from "ethers";
import erc20 from "../src/erc20";
import mstable from "../src/mstable";
import uniswap from "../src/uniswap";
import balancer from "../src/balancer";
import { fromWei, increaseTime } from "./utils";

const { parseEther, parseUnits, bigNumberify } = ethers.utils;

const MAX_UINT256 = bigNumberify("2").pow("256").sub("1");
const BALANCER_MUSD_USDC_50_50_POOL_ADDRESS =
  "0x72Cd8f4504941Bf8c5a21d1Fd83A96499FD71d2C";
const MSTABLE_MUSD_USDC_50_50_POOL_EARN_ADDRESS =
  "0x881c72d1e6317f10a1cdcbe05040e7564e790c80";

describe("mStable", () => {
  let wallet: Wallet;
  let provider: any;
  let mUSD: Contract;
  let dai: Contract;
  let usdc: Contract;
  let pool: Contract;
  let earn: Contract;
  let mta: Contract;

  beforeAll(async () => {
    ethers.errors.setLogLevel("error");

    // @ts-ignore
    wallet = global.wallet;
    // @ts-ignore
    provider = global.provider;

    mUSD = new ethers.Contract(mstable.mUSD.address, mstable.mUSD.abi, wallet);
    dai = new ethers.Contract(erc20.dai.address, erc20.dai.abi, wallet);
    usdc = new ethers.Contract(erc20.usdc.address, erc20.usdc.abi, wallet);
    pool = new ethers.Contract(
      BALANCER_MUSD_USDC_50_50_POOL_ADDRESS,
      balancer.BPool.abi,
      wallet,
    );

    earn = new ethers.Contract(
      MSTABLE_MUSD_USDC_50_50_POOL_EARN_ADDRESS,
      mstable.StakingRewardsWithPlatformToken.abi,
      wallet,
    );

    mta = new ethers.Contract(mstable.MTA.address, mstable.MTA.abi, wallet);
  });

  test("Get some DAI from Uniswap", async () => {
    const uniswapFactory = new ethers.Contract(
      uniswap.factory.address,
      uniswap.factory.abi,
      wallet,
    );

    const exchangeAddress = await uniswapFactory.getExchange(dai.address);

    const exchange = new ethers.Contract(
      exchangeAddress,
      uniswap.exchange.abi,
      wallet,
    );

    // given
    const before = await dai.balanceOf(wallet.address);
    expect(fromWei(before)).toBe("0.0");

    const ethToSell = parseEther("50");
    const expectedUsdc = await exchange.getEthToTokenInputPrice(ethToSell);

    // when
    const min = 1;
    const deadline = 2525644800;
    await exchange.ethToTokenSwapInput(min, deadline, {
      gasLimit: 4000000,
      value: ethToSell,
    });

    // then
    const after = await dai.balanceOf(wallet.address);
    expect(fromWei(after)).toBe(fromWei(expectedUsdc));
  });

  test("Mint mUSD using DAI", async () => {
    // given
    const beforeWei = await mUSD.balanceOf(wallet.address);
    const before = parseFloat(fromWei(beforeWei));
    expect(before).toEqual(0);

    const daiToDeposit = parseEther("5000");

    await dai.approve(mUSD.address, daiToDeposit);

    // when
    await mUSD.mint(dai.address, daiToDeposit, { gasLimit: 700000 });

    // then
    const afterWei = await mUSD.balanceOf(wallet.address);
    const after = parseFloat(fromWei(afterWei));
    expect(after).toBe(parseFloat(fromWei(daiToDeposit)));
  });

  test("Redeem USDC using mUSD", async () => {
    // given
    const beforeWei = await usdc.balanceOf(wallet.address);
    const before = parseFloat(fromWei(beforeWei));
    expect(before).toEqual(0);

    const toRedeemWei = parseUnits("1000", erc20.usdc.decimals);
    const swapFee = await mUSD.swapFee();
    const feeToPay = toRedeemWei.mul(swapFee).div(parseEther("1"));

    // when
    await mUSD.redeem(usdc.address, toRedeemWei, {
      gasLimit: 700000,
    });

    // then
    const afterWei = await usdc.balanceOf(wallet.address);
    const after = parseFloat(fromWei(afterWei));
    expect(after).toBe(parseFloat(fromWei(toRedeemWei.sub(feeToPay))));
  });

  describe("Earn MTA", () => {
    test("Add liqudity to mUSD/USDC Balancer Pool", async () => {
      // given
      const bptBeforeWei = await pool.balanceOf(wallet.address);
      const bptBefore = parseFloat(fromWei(bptBeforeWei));
      expect(bptBefore).toEqual(0);

      await mUSD.approve(pool.address, MAX_UINT256);
      await usdc.approve(pool.address, MAX_UINT256);

      // when
      const poolAmountOut = parseEther("2.5");
      const maxAmountsIn = [
        parseUnits("500", mstable.mUSD.decimals),
        parseUnits("500", erc20.usdc.decimals),
      ];
      await pool.joinPool(poolAmountOut, maxAmountsIn, { gasLimit: 500000 });

      // then
      const bptAfterWei = await pool.balanceOf(wallet.address);
      const bptAfter = parseFloat(fromWei(bptAfterWei));
      expect(bptAfter).toEqual(parseFloat(fromWei(poolAmountOut)));
    });

    test("Stake BPT to earn MTA", async () => {
      // given
      const mtaBeforeWei = await mta.balanceOf(wallet.address);
      const mtaBefore = parseFloat(fromWei(mtaBeforeWei));
      expect(mtaBefore).toEqual(0);

      const bptBalance = await pool.balanceOf(wallet.address);

      await pool.approve(earn.address, MAX_UINT256);

      // when
      await earn.stake(wallet.address, bptBalance);
      await increaseTime(provider, 60 * 60 * 24);
      await earn.claimReward();

      // then
      const mtaAfterWei = await mta.balanceOf(wallet.address);
      const mtaAfter = parseFloat(fromWei(mtaAfterWei));
      expect(mtaAfter).toBeGreaterThan(0);
    });
  });
});
