jest.setTimeout(1000000);

import { Wallet, Contract, ethers } from "ethers";

// import legos
import erc20 from "../src/erc20";
import uniswap from "../src/uniswap";
import synthetix from "../src/synthetix";
import { fromWei, increaseTime } from "./utils";

const { parseEther, formatBytes32String } = ethers.utils;

describe("synthetix", () => {
  const someAccount = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0";
  let wallet: Wallet;
  let snxContract: Contract;
  let snxExchangeContract: Contract;
  let sUSDContract: Contract;
  let synthetixContract: Contract;
  let exchangeRatesContract: Contract;
  let exchangerContract: Contract;
  let sXAUContract: Contract;
  let depotContract: Contract;
  const sUSDKey = formatBytes32String("sUSD");
  const sXAUKey = formatBytes32String("sXAU");

  beforeAll(async () => {
    ethers.errors.setLogLevel("error");

    // @ts-ignore
    wallet = global.wallet;
    snxContract = new ethers.Contract(erc20.snx.address, erc20.abi, wallet);

    const uniswapFactoryContract = new ethers.Contract(
      uniswap.factory.address,
      uniswap.factory.abi,
      wallet,
    );

    const snxExchangeAddress = await uniswapFactoryContract.getExchange(
      erc20.snx.address,
    );

    snxExchangeContract = new ethers.Contract(
      snxExchangeAddress,
      uniswap.exchange.abi,
      wallet,
    );

    sUSDContract = new ethers.Contract(
      synthetix.sUSD.address,
      synthetix.sUSD.abi,
      wallet,
    );

    synthetixContract = new ethers.Contract(
      synthetix.Synthetix.address,
      synthetix.Synthetix.abi,
      wallet,
    );

    exchangeRatesContract = new ethers.Contract(
      synthetix.ExchangeRates.address,
      synthetix.ExchangeRates.abi,
      wallet,
    );

    exchangerContract = new ethers.Contract(
      synthetix.Exchanger.address,
      synthetix.Exchanger.abi,
      wallet,
    );

    sXAUContract = new ethers.Contract(
      synthetix.sXAU.address,
      synthetix.sXAU.abi,
      wallet,
    );

    depotContract = new ethers.Contract(
      synthetix.Depot.address,
      synthetix.Depot.abi,
      wallet,
    );
  });

  test("get some SNX from Uniswap", async () => {
    // given
    const snxBefore = await snxContract.balanceOf(wallet.address);
    expect(fromWei(snxBefore)).toBe("0.0");

    const ethToSell = 5;
    const ethToSellInWei = parseEther(ethToSell.toString());

    const expectedSnx = await snxExchangeContract.getEthToTokenInputPrice(
      ethToSellInWei,
    );

    // when
    const min = 1;
    const deadline = 2525644800;
    await snxExchangeContract.ethToTokenSwapInput(min, deadline, {
      gasLimit: 4000000,
      value: ethToSellInWei,
    });

    // then
    const snxAfter = await snxContract.balanceOf(wallet.address);
    expect(fromWei(snxAfter)).toBe(fromWei(expectedSnx));
  });

  // https://blog.quiknode.io/an-ultimate-guide-to-synthetix/
  test("issue 100 sUSD tokens", async () => {
    // given
    const sUSDBefore = await sUSDContract.balanceOf(wallet.address);
    expect(fromWei(sUSDBefore)).toBe("0.0");

    const sUSDToMint = 100;
    const sUSDToMintInWei = parseEther(sUSDToMint.toString());

    const {
      maxIssuable,
      alreadyIssued: alreadyIssuedBefore,
    } = await synthetixContract.remainingIssuableSynths(wallet.address);
    expect(alreadyIssuedBefore.toString()).toBe("0");
    expect(parseFloat(fromWei(maxIssuable))).toBeGreaterThanOrEqual(sUSDToMint);

    // when
    await synthetixContract.issueSynths(sUSDToMintInWei, {
      gasLimit: 4000000,
    });

    const {
      alreadyIssued: alreadyIssuedAfter,
    } = await synthetixContract.remainingIssuableSynths(wallet.address);
    expect(alreadyIssuedAfter.toString()).toBe(sUSDToMintInWei.toString());

    // then
    const sUSDAfter = await sUSDContract.balanceOf(wallet.address);
    expect(fromWei(sUSDAfter)).toBe(fromWei(sUSDToMintInWei));
  });

  test("shouldn't be able to transfer locked SNX tokens", async () => {
    // given
    const snxBalance = await snxContract.balanceOf(wallet.address);
    const snxBalanceInFloat = parseFloat(fromWei(snxBalance));

    const transferableSnx = await synthetixContract.transferableSynthetix(
      wallet.address,
    );
    const transferableSnxInFloat = parseFloat(fromWei(transferableSnx));

    expect(transferableSnxInFloat).toBeLessThan(snxBalanceInFloat);

    // when-then
    await expect(
      snxContract.transfer(someAccount, snxBalance),
    ).rejects.toThrow();
  });

  test("exchange from sUSD to sXAU", async () => {
    // given
    const sUSDBefore = await sUSDContract.balanceOf(wallet.address);
    const sXAUBefore = await sXAUContract.balanceOf(wallet.address);
    expect(fromWei(sXAUBefore)).toBe("0.0");

    const sUSDToSell = 50;
    const sUSDToSellInWei = parseEther(sUSDToSell.toString());

    const expectedXAUToBuy = await exchangeRatesContract.effectiveValue(
      sUSDKey,
      sUSDToSellInWei,
      sXAUKey,
    );

    // when
    const src = sUSDKey;
    const fromAmount = parseEther(sUSDToSell.toString());
    const dest = sXAUKey;
    await synthetixContract.exchange(src, fromAmount, dest, {
      gasLimit: 4000000,
    });

    // then
    const sUSDAfter = await sUSDContract.balanceOf(wallet.address);
    const sUSDLost = parseFloat(fromWei(sUSDBefore.sub(sUSDAfter)));
    const sXAUAfter = await sXAUContract.balanceOf(wallet.address);

    expect(sUSDLost).toBe(sUSDToSell);
    expect(parseFloat(fromWei(sXAUAfter))).toBeCloseTo(
      parseFloat(fromWei(expectedXAUToBuy)),
    );
  });

  test("exchange back sXAU to sUSD", async () => {
    // given
    const sXAUBefore = await sXAUContract.balanceOf(wallet.address);
    const waitingPeriod = await exchangerContract.waitingPeriodSecs();

    //TODO: Omit global.provider
    //@ts-ignore
    await increaseTime(global.provider, waitingPeriod.toString());
    expect(await synthetixContract.isWaitingPeriod(sXAUKey)).toBe(false);

    // when
    const src = sXAUKey;
    const sourceAmount = sXAUBefore;
    const dest = sUSDKey;
    await synthetixContract.exchange(src, sourceAmount, dest, {
      gasLimit: 4000000,
    });

    // then
    const sXAUAfter = await sXAUContract.balanceOf(wallet.address);
    expect(fromWei(sXAUAfter)).toBe("0.0");
  });

  // TODO: Fix
  // https://blog.synthetix.io/what-you-need-to-know-before-staking-snx-for-the-first-time/
  test("pay all debts", async () => {
    // given
    const sUSDBefore = await sUSDContract.balanceOf(wallet.address);
    const minimumStakeTime = 24 * 60 * 60; // 24h

    //TODO: Omit global.provider
    //@ts-ignore
    // await increaseTime(global.provider, minimumStakeTime.toString());
    console.log(`sUSDBefore = ${sUSDBefore}`);
    // when
    await synthetixContract.burnSynths(sUSDBefore);

    // then
    const sUSDAfter = await sUSDContract.balanceOf(wallet.address);
    expect(fromWei(sUSDAfter)).toBe("0.0");
  });
});
