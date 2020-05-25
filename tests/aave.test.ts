jest.setTimeout(100000);

import { Wallet, Contract, ethers } from "ethers";

// import legos
import erc20 from "../src/erc20";
import aave from "../src/aave";
import { fromWei } from "./utils";
import { parseUnits } from "ethers/utils";

const { parseEther, bigNumberify } = ethers.utils;

describe("aave", () => {
  let wallet: Wallet;
  let daiContract: Contract;
  let aEthContract: Contract;
  let lendingPool: Contract;
  let aDaiContract: Contract;

  beforeAll(async () => {
    ethers.errors.setLogLevel("error");

    // @ts-ignore
    wallet = global.wallet;
    daiContract = new ethers.Contract(erc20.dai.address, erc20.abi, wallet);
    aEthContract = new ethers.Contract(
      aave.aETH.address,
      aave.aETH.abi,
      wallet,
    );
    aDaiContract = new ethers.Contract(
      aave.aDAI.address,
      aave.aDAI.abi,
      wallet,
    );
    lendingPool = new ethers.Contract(
      aave.LendingPool.address,
      aave.LendingPool.abi,
      wallet,
    );
  });

  test("lend 10 ETH (i.e. mint aETH)", async () => {
    // given
    const ethToLend = 10;
    const before = await aEthContract.balanceOf(wallet.address);

    // when
    const { address: reserveAddress } = erc20.eth;
    const amount = parseEther(ethToLend.toString());
    const referralCode = "0";
    await lendingPool.deposit(reserveAddress, amount, referralCode, {
      gasLimit: 1500000,
      value: amount,
    });

    // then
    const after = await aEthContract.balanceOf(wallet.address);

    const ethLended = parseFloat(fromWei(after.sub(before)));
    expect(ethLended).toBeCloseTo(ethToLend);
  });

  test("borrow 20 DAI", async () => {
    // given
    const before = await daiContract.balanceOf(wallet.address);

    // when
    const { address: reserveAddress } = erc20.dai;
    const amount = parseEther("20");
    const interestRateMode = 1; // 1 = STABLE RATE, 2 = VARIABLE RATE
    const referralCode = "0";
    await lendingPool.borrow(
      reserveAddress,
      amount,
      interestRateMode,
      referralCode,
      { gasLimit: 1500000 },
    );

    // then
    const after = await daiContract.balanceOf(wallet.address);
    const daiBorrowed = parseFloat(fromWei(after.sub(before)));
    expect(daiBorrowed).toBe(20);
  });

  test("lend 5 DAI", async () => {
    // given
    const daiToLend = 5;
    const daiToLendInWei = parseEther(daiToLend.toString());

    const aDaiBefore = await aDaiContract.balanceOf(wallet.address);

    // when
    await daiContract.approve(aave.LendingPoolCore.address, daiToLendInWei);

    const { address: reserveAddress } = erc20.dai;
    const amount = daiToLendInWei;
    const referralCode = "0";
    await lendingPool.deposit(reserveAddress, amount, referralCode, {
      gasLimit: 1500000,
    });

    // then
    const aDaiAfter = await aDaiContract.balanceOf(wallet.address);

    const daiLended = parseFloat(fromWei(aDaiAfter.sub(aDaiBefore)));
    expect(daiLended).toBeCloseTo(daiToLend);
  });

  test("get supply/borrow balances for DAI", async () => {
    // when
    const {
      currentATokenBalance: daiLended,
      currentBorrowBalance: daiBorrowed,
    } = await lendingPool.getUserReserveData(erc20.dai.address, wallet.address);

    // then
    expect(parseFloat(fromWei(daiBorrowed))).toBeCloseTo(20);
    expect(parseFloat(fromWei(daiLended))).toBeCloseTo(5);
  });

  test("withdraw 1 ETH from collateral", async () => {
    // given
    const ethBefore = await wallet.getBalance();
    const ethToRedeem = 1;
    const ethToRedeemInWei = parseEther(ethToRedeem.toString());

    // when
    await aEthContract.redeem(ethToRedeemInWei, {
      gasLimit: 1500000,
    });

    // then
    const ethAfter = await wallet.getBalance();

    const ethGained = parseFloat(fromWei(ethAfter.sub(ethBefore)));
    expect(ethGained).toBeCloseTo(ethToRedeem, 1);
  });

  test("repay 1 DAI of debt", async () => {
    // given
    const daiToRepay = 1;
    const daiToRepayInWei = parseEther(daiToRepay.toString());

    const daiBefore = await daiContract.balanceOf(wallet.address);

    // when
    await daiContract.approve(aave.LendingPoolCore.address, daiToRepayInWei);

    await lendingPool.repay(
      erc20.dai.address,
      daiToRepayInWei,
      wallet.address,
      {
        gasLimit: 1500000,
      },
    );

    // then
    const daiAfter = await daiContract.balanceOf(wallet.address);

    const daiSpent = parseFloat(fromWei(daiBefore.sub(daiAfter)));
    expect(daiSpent).toBe(daiToRepay);
  });

  test("retrieve current health factor", async () => {
    // when
    const { healthFactor } = await lendingPool.getUserAccountData(
      wallet.address,
    );

    // then
    expect(parseFloat(fromWei(healthFactor))).toBeGreaterThan(1);
  });
});
