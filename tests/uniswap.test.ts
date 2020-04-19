jest.setTimeout(100000);

import { Wallet, Contract, ethers } from "ethers";
import { fromWei } from "./utils";

// import legos
import erc20 from "../src/erc20";
import uniswap from "../src/uniswap";

describe("uniswap", () => {
  let wallet: Wallet, daiContract: Contract;

  beforeAll(async () => {
    ethers.errors.setLogLevel("error");
    
    // @ts-ignore
    wallet = global.wallet;
    daiContract = new ethers.Contract(
      erc20.contracts.dai.address,
      erc20.abi,
      wallet,
    );
  });

  test("buy DAI from Uniswap", async () => {
    const { factory, exchange } = uniswap.contracts;
    const uniswapFactoryContract = new ethers.Contract(
      factory.address,
      factory.abi,
      wallet,
    );

    const daiExchangeAddress = await uniswapFactoryContract.getExchange(
      erc20.contracts.dai.address,
    );

    const daiExchangeContract = new ethers.Contract(
      daiExchangeAddress,
      exchange.abi,
      wallet,
    );

    const ethBefore = await wallet.getBalance();
    const daiBefore = await daiContract.balanceOf(wallet.address);

    const expectedDai = await daiExchangeContract.getEthToTokenInputPrice(
      ethers.utils.parseEther("5"),
    );

    // do the actual swapping
    await daiExchangeContract.ethToTokenSwapInput(
      1, // min amount of token retrieved
      2525644800, // random timestamp in the future (year 2050)
      {
        gasLimit: 4000000,
        value: ethers.utils.parseEther("5"),
      },
    );

    const ethAfter = await wallet.getBalance();
    const daiAfter = await daiContract.balanceOf(wallet.address);

    const ethLost = parseFloat(fromWei(ethBefore.sub(ethAfter)));

    expect(fromWei(daiBefore)).toBe("0.0");
    expect(fromWei(daiAfter)).toBe(fromWei(expectedDai));
    expect(ethLost).toBeCloseTo(5);
  });
});
