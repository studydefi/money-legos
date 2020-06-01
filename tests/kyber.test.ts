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
    const ethBefore = await wallet.getBalance();
    const daiBefore = await daiContract.balanceOf(wallet.address);

    const {
      expectedRate,
      slippageRate,
    } = await kyberNetworkContract.getExpectedRate(
      erc20.eth.address,
      erc20.dai.address,
      parseEther(`${ethToSwap}`),
    );

    const expectedDai = expectedRate.mul(bigNumberify(`${ethToSwap}`));

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

    const ethAfter = await wallet.getBalance();
    const daiAfter = await daiContract.balanceOf(wallet.address);

    const ethLost = parseFloat(fromWei(ethBefore.sub(ethAfter)));

    expect(fromWei(daiBefore)).toBe("0.0");
    expect(parseFloat(fromWei(daiAfter))).toBeCloseTo(
      parseFloat(fromWei(expectedDai)),
      1,
    );
    expect(ethLost).toBeCloseTo(ethToSwap, 1);
  });
});
