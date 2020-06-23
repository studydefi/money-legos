jest.setTimeout(500000);

import { Wallet, Contract, ethers } from "ethers";
import { fromWei } from "./utils";

// import legos
import erc20 from "../src/erc20";
import kyber from "../src/kyber";

const { parseEther, bigNumberify } = ethers.utils;

describe("kyber", () => {
  let wallet: Wallet, daiContract: Contract;

  beforeAll(async () => {
    ethers.errors.setLogLevel("error");

    // @ts-ignore
    wallet = global.wallet;
    daiContract = new ethers.Contract(erc20.dai.address, erc20.abi, wallet);
  });

  test("buy DAI from Kyber.Network", async () => {
    const kyberNetworkContract = new ethers.Contract(
      kyber.network.address,
      kyber.network.abi,
      wallet,
    );

    const ethToSwap = 5;
    const ethBeforeWei = await wallet.getBalance();
    const daiBeforeWei = await daiContract.balanceOf(wallet.address);

    const {
      expectedRate,
      slippageRate,
    } = await kyberNetworkContract.getExpectedRate(
      erc20.eth.address,
      erc20.dai.address,
      parseEther(`${ethToSwap}`),
    );

    const expectedDaiWei = expectedRate.mul(bigNumberify(`${ethToSwap}`));
    const expectedDai = parseFloat(fromWei(expectedDaiWei));

    // do the actual swapping
    const minConversionRate = slippageRate;
    await kyberNetworkContract.swapEtherToToken(
      erc20.dai.address,
      minConversionRate,
      {
        gasLimit: 4000000,
        value: parseEther(`${ethToSwap}`),
      },
    );

    const ethAfterWei = await wallet.getBalance();
    const daiAfterWei = await daiContract.balanceOf(wallet.address);

    const daiAfter = parseFloat(fromWei(daiAfterWei));
    const ethLost = parseFloat(fromWei(ethBeforeWei.sub(ethAfterWei)));

    expect(fromWei(daiBeforeWei)).toBe("0.0");
    expect(daiAfter).toBeCloseTo(expectedDai);
    expect(ethLost).toBeCloseTo(ethToSwap);
  });
});
