jest.setTimeout(100000);

import { Wallet, Contract, ethers } from "ethers";
import erc20 from "../src/erc20";
import mstable from "../src/mstable";
import uniswap from "../src/uniswap";
import { fromWei } from "./utils";

const { parseEther } = ethers.utils;

describe("mStable", () => {
  let wallet: Wallet;
  let mUSD: Contract;
  let dai: Contract;

  beforeAll(async () => {
    ethers.errors.setLogLevel("error");

    // @ts-ignore
    wallet = global.wallet;
    mUSD = new ethers.Contract(mstable.mUSD.address, mstable.mUSD.abi, wallet);
    dai = new ethers.Contract(erc20.dai.address, erc20.dai.abi, wallet);
  });

  test("get some DAI from Uniswap", async () => {
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

    const ethToSell = parseEther("5");
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

  test("mint mUSD using DAI", async () => {
    // given
    const beforeWei = await mUSD.balanceOf(wallet.address);
    const before = parseFloat(fromWei(beforeWei));
    expect(before).toEqual(0);

    const usdcToDeposit = parseEther("100");

    await dai.approve(mUSD.address, usdcToDeposit);

    // when
    await mUSD.mint(dai.address, usdcToDeposit, { gasLimit: 700000 });

    // then
    const afterWei = await mUSD.balanceOf(wallet.address);
    const after = parseFloat(fromWei(afterWei));
    expect(after).toBe(parseFloat(fromWei(usdcToDeposit)));
  });
});
