jest.setTimeout(100000);

import { Wallet, ethers } from "ethers";

// import legos
import maker from "../src/maker";
import { fromWei } from "./utils";

describe("maker medianizer", () => {
  let wallet: Wallet;

  beforeAll(async () => {
    ethers.errors.setLogLevel("error");

    // @ts-ignore
    wallet = global.wallet;
  });

  test("read ETH price from medianizer", async () => {
    const makerMedianizer = new ethers.Contract(
      maker.ethUsdPriceFeed.address,
      maker.ethUsdPriceFeed.abi,
      wallet,
    );

    const ethPriceUsdWei = await makerMedianizer.read();
    const ethPriceUsd = parseFloat(fromWei(ethPriceUsdWei));

    expect(ethPriceUsd).toBeGreaterThan(0);
    expect(ethPriceUsd).toBeLessThan(1000);
  });
});
