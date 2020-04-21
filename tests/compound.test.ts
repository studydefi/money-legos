jest.setTimeout(100000);

import { Wallet, Contract, ethers } from "ethers";

// import legos
import erc20 from "../src/erc20";
import compound from "../src/compound";
import { fromWei } from "./utils";
import { BigNumber } from "ethers/utils";

describe("compound", () => {
  let wallet: Wallet, daiContract: Contract;

  beforeAll(async () => {
    ethers.errors.setLogLevel("error");

    // @ts-ignore
    wallet = global.wallet;
    daiContract = new ethers.Contract(erc20.dai.address, erc20.abi, wallet);
  });

  test("enter markets", async () => {
    const comptroller = new ethers.Contract(
      compound.comptroller.address,
      compound.comptroller.abi,
      wallet,
    );

    const before = await comptroller.getAssetsIn(wallet.address);

    const { cEther, cDAI } = compound;
    await comptroller.enterMarkets([cEther.address, cDAI.address]);

    const after = await comptroller.getAssetsIn(wallet.address);

    expect(before).toEqual([]);
    expect(after).toEqual([cEther.address, cDAI.address]);
  });

  test("supply 10 ETH (i.e. mint cETH)", async () => {
    const cEtherContract = new ethers.Contract(
      compound.cEther.address,
      compound.cEther.abi,
      wallet,
    );

    const before = await cEtherContract.balanceOf(wallet.address);
    const cEthBefore = parseFloat(fromWei(before, 8));

    // we supply ETH by minting cETH
    await cEtherContract.mint({
      gasLimit: 1500000,
      value: ethers.utils.parseEther("10"),
    });

    const after = await cEtherContract.balanceOf(wallet.address);
    const cEthAfter = parseFloat(fromWei(after, 8));

    expect(cEthBefore).toBe(0);
    expect(cEthAfter).toBeGreaterThan(0);
  });

  test("borrow 20 DAI", async () => {
    const cDaiContract = new ethers.Contract(
      compound.cDAI.address,
      compound.cDAI.abi,
      wallet,
    );

    const before = await daiContract.balanceOf(wallet.address);

    await cDaiContract.borrow(
      ethers.utils.parseUnits("20", erc20.dai.decimals),
      { gasLimit: 1500000 },
    );

    const after = await daiContract.balanceOf(wallet.address);

    const daiGained = parseFloat(fromWei(after.sub(before)));
    expect(daiGained).toBe(20);
  });

  test("supply 5 DAI", async () => {
    const cDaiContract = new ethers.Contract(
      compound.cDAI.address,
      compound.cDAI.abi,
      wallet,
    );

    // check DAI and cDAI balances before
    const daiBefore = await daiContract.balanceOf(wallet.address);
    const cDaiBefore = await cDaiContract.balanceOf(wallet.address);

    const daiToSupply = ethers.utils.parseUnits("5", erc20.dai.decimals);

    // need to approve first
    await daiContract.approve(compound.cDAI.address, daiToSupply);

    // we supply DAI by minting cDAI
    await cDaiContract.mint(daiToSupply, { gasLimit: 1500000 });

    // check DAI and cDAI balances after
    const daiAfter = await daiContract.balanceOf(wallet.address);
    const cDaiAfter = await cDaiContract.balanceOf(wallet.address);

    const daiSpent = parseFloat(fromWei(daiBefore.sub(daiAfter)));
    const cDaiGained = parseFloat(fromWei(cDaiAfter.sub(cDaiBefore), 8));

    expect(daiSpent).toBe(5);
    expect(cDaiGained).toBeGreaterThan(0);
  });
  
  test("get supply/borrow balances for DAI", async () => {
    const cDaiContract = new ethers.Contract(
      compound.cDAI.address,
      compound.cDAI.abi,
      wallet,
    );

    const [
      _,
      cTokenBalance,
      borrowBalance,
      exchangeRateMantissa,
    ] = await cDaiContract.getAccountSnapshot(wallet.address);

    const expScale = new BigNumber(10).pow(18);
    const supplied = cTokenBalance.mul(exchangeRateMantissa).div(expScale);

    expect(parseFloat(fromWei(supplied))).toBeCloseTo(5);
    expect(parseFloat(fromWei(borrowBalance))).toBeCloseTo(20);
  });

  test("withdraw 1 ETH from collateral", async () => {
    const cEtherContract = new ethers.Contract(
      compound.cEther.address,
      compound.cEther.abi,
      wallet,
    );

    const ethBefore = await wallet.getBalance();

    // withdraw 1 Ether
    await cEtherContract.redeemUnderlying(ethers.utils.parseEther("1"), {
      gasLimit: 1500000,
    });

    const ethAfter = await wallet.getBalance();

    const ethGained = parseFloat(fromWei(ethAfter.sub(ethBefore)));
    expect(ethGained).toBeCloseTo(1);
  });

  test("repay 1 DAI of debt", async () => {
    const amountToRepay = ethers.utils.parseUnits("1", erc20.dai.decimals);

    const cDaiContract = new ethers.Contract(
      compound.cDAI.address,
      compound.cDAI.abi,
      wallet,
    );

    // approve transferFrom
    await daiContract.approve(compound.cDAI.address, amountToRepay);

    const daiBefore = await daiContract.balanceOf(wallet.address);

    // Repays 1 DAI
    await cDaiContract.repayBorrow(amountToRepay, {
      gasLimit: 1500000,
    });

    const daiAfter = await daiContract.balanceOf(wallet.address);

    const daiSpent = parseFloat(fromWei(daiBefore.sub(daiAfter)));
    expect(daiSpent).toBe(1);
  });
});
