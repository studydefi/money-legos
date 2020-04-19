jest.setTimeout(100000);

import { Wallet, Contract, ethers } from "ethers";
import { fromWei } from "./utils";

// import legos
import erc20 from "../src/erc20";

describe("initial conditions", () => {
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

  test("initial DAI balance of 0", async () => {
    const daiBalance = await daiContract.balanceOf(wallet.address);
    expect(fromWei(daiBalance)).toBe("0.0");
  });

  test("initial ETH balance of 1000 ETH", async () => {
    // note: this is set in test-environment.js when we spin up the test chain
    const ethBalance = await wallet.getBalance();
    expect(fromWei(ethBalance)).toBe("1000.0");
  });
});
