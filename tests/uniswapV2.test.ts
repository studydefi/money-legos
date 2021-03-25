jest.setTimeout(100000);

import { Wallet, Contract, ethers } from "ethers";
import { fromWei } from "./utils";

const { parseEther } = ethers.utils;

// import legos
import erc20 from "../src/erc20";
import uniswapV2 from "../src/uniswapV2";

describe("uniswapV2", () => {
  let wallet: Wallet;
  let dai: Contract;

  beforeAll(async () => {
    ethers.errors.setLogLevel("error");

    // @ts-ignore
    wallet = global.wallet;
    dai = new ethers.Contract(erc20.dai.address, erc20.abi, wallet);
  });

  test("buy DAI from UniswapV2", async () => {
    const uniswapRouter02 = new ethers.Contract(
      uniswapV2.router02.address,
      uniswapV2.router02.abi,
      wallet,
    );
    const path = [erc20.weth.address, erc20.dai.address];

    const ethBefore = await wallet.getBalance();
    const daiBefore = await dai.balanceOf(wallet.address);

    const amountIn = parseEther("5");
    const [, expectedDai] = await uniswapRouter02.getAmountsOut(amountIn, path);

    // do the actual swapping
    await uniswapRouter02.swapExactETHForTokens(
      1, // amountOutMin
      path,
      wallet.address, // to
      ethers.constants.MaxUint256, // deadline
      {
        gasLimit: 4000000,
        value: amountIn,
      },
    );

    const ethAfter = await wallet.getBalance();
    const daiAfter = await dai.balanceOf(wallet.address);

    const ethLost = parseFloat(fromWei(ethBefore.sub(ethAfter)));

    expect(fromWei(daiBefore)).toBe("0.0");
    expect(fromWei(daiAfter)).toBe(fromWei(expectedDai));
    expect(ethLost).toBeCloseTo(5);
  });
});
