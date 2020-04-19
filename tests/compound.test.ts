jest.setTimeout(100000);

import { Wallet, Contract, ethers } from "ethers";

// import legos
import erc20 from "../src/erc20";
import compound from "../src/compound";
import { fromWei } from "./utils";

describe("compound", () => {
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

    expect(before).toEqual([]);
    expect(after).toEqual([cEther.address, cDAI.address]);
  });

  test("supply 1 ETH; mint cETH", async () => {
    const cEtherContract = new ethers.Contract(
      compound.contracts.cEther.address,
      compound.contracts.cEther.abi,
      wallet,
    );

    const before = await cEtherContract.balanceOf(wallet.address);
    const cEthBefore = parseFloat(fromWei(before, 8));

    // we supply ETH by minting cETH
    await cEtherContract.mint({
      gasLimit: 1500000,
      value: ethers.utils.parseEther("1"),
    });

    const after = await cEtherContract.balanceOf(wallet.address);
    const cEthAfter = parseFloat(fromWei(after, 8));

    expect(cEthBefore).toBe(0);
    expect(cEthAfter).toBeGreaterThan(0);
  });

  test("borrow 20 DAI", async () => {
    const cDaiContract = new ethers.Contract(
      compound.contracts.cDAI.address,
      compound.contracts.cDAI.abi,
      wallet,
    );

    const before = await daiContract.balanceOf(wallet.address);

    await cDaiContract.borrow(
      ethers.utils.parseUnits("20", erc20.contracts.dai.decimals),
      { gasLimit: 1500000 },
    );

    const after = await daiContract.balanceOf(wallet.address);

    const daiGained = parseFloat(fromWei(after.sub(before)));
    expect(daiGained).toBe(20);
  });

  test("supply 5 DAI", async () => {
    const cDaiContract = new ethers.Contract(
      compound.contracts.cDAI.address,
      compound.contracts.cDAI.abi,
      wallet,
    );

    // check DAI and cDAI balances before
    const daiBefore = await daiContract.balanceOf(wallet.address);
    const cDaiBefore = await cDaiContract.balanceOf(wallet.address);

    const daiToSupply = ethers.utils.parseUnits(
      "5",
      erc20.contracts.dai.decimals,
    );

    // need to approve first
    await daiContract.approve(compound.contracts.cDAI.address, daiToSupply);

    // we supply DAI by minting cDAI
    await cDaiContract.mint(daiToSupply, { gasLimit: 1500000 });

    // check DAI and cDAI balances after
    const daiAfter = await daiContract.balanceOf(wallet.address);
    const cDaiAfter = await cDaiContract.balanceOf(wallet.address);

    const daiLost = parseFloat(fromWei(daiBefore.sub(daiAfter)));
    const cDaiGained = parseFloat(fromWei(cDaiAfter.sub(cDaiBefore), 8));

    expect(daiLost).toBe(5);
    expect(cDaiGained).toBeGreaterThan(0);
  });
});
