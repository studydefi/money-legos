jest.setTimeout(100000);

import { Wallet, Contract, ethers } from "ethers";

// import legos
import erc20 from "../src/erc20";
import compound from "../src/compound";

describe("compount", () => {
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

  test("enter markets", async () => {
    const comptroller = new ethers.Contract(
      compound.contracts.comptroller.address,
      compound.contracts.comptroller.abi,
      wallet,
    );

    const before = await comptroller.getAssetsIn(wallet.address);

    const { cEther, cDAI } = compound.contracts;
    await comptroller.enterMarkets([cEther.address, cDAI.address]);

    const after = await comptroller.getAssetsIn(wallet.address);

    expect(before).toStrictEqual([]);
    expect(after).toEqual([cEther.address, cDAI.address]);
  });
});
