import dotenv from "dotenv";
dotenv.config();

import { Wallet, Contract, ethers } from "ethers";

import { startChain } from "./test-chain";
import { fromWei } from "./utils";

import erc20 from "../src/erc20";
import uniswap from "../src/uniswap";

describe("integration tests with forked mainnet", () => {
  let wallet: Wallet, daiContract: Contract;

  beforeAll(async () => {
    wallet = await startChain();
    daiContract = new ethers.Contract(
      erc20.contracts.dai.address,
      erc20.contracts.abi,
      wallet,
    );
  });

  test("initial DAI balance of 0", async () => {
    const daiBalance = await daiContract.balanceOf(wallet.address);
    expect(fromWei(daiBalance)).toBe("0.0");
  });

  test("initial ETH balance of ~1000 ETH", async () => {
    const ethBalance = await wallet.getBalance();
    expect(fromWei(ethBalance)).toBe("1000.0");
  });

  test("get some DAI", async () => {
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

    const before = await daiContract.balanceOf(wallet.address);

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

    const after = await daiContract.balanceOf(wallet.address);

    expect(fromWei(before)).toBe("0.0");
    expect(fromWei(after)).toBe(fromWei(expectedDai));
  });
});
