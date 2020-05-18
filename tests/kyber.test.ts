import { expect } from "chai";
import { ethers } from "@nomiclabs/buidler";
import { Contract } from "ethers";
import { fromWei } from "./utils";

// import legos
import erc20 from "../src/erc20";
import kyber from "../src/kyber";
import { BigNumber } from "ethers/utils";

const { parseEther, bigNumberify } = ethers.utils;

describe("kyber", () => {
  let wallet: any;
  let daiContract: Contract;
  let kyberNetworkContract: Contract;
  const ethToSwap = 5;

  before(async () => {
    ethers.errors.setLogLevel("error");

    [wallet] = await ethers.getSigners();
    daiContract = new ethers.Contract(erc20.dai.address, erc20.abi, wallet);
    kyberNetworkContract = new ethers.Contract(
      kyber.network.address,
      kyber.network.abi,
      wallet,
    );
  });

  it("buy DAI from Kyber.Network", async () => {
    const ethBefore = await wallet.getBalance();
    const daiBefore = await daiContract.balanceOf(wallet.getAddress());

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
    const daiAfter = await daiContract.balanceOf(wallet.getAddress());

    const ethLost = parseFloat(fromWei(ethBefore.sub(ethAfter)));

    expect(fromWei(daiBefore)).to.equal("0.0");
    expect(fromWei(daiAfter)).to.equal(fromWei(expectedDai));
    expect(ethLost).to.be.approximately(ethToSwap, 0.1);
  });

  it("solidity tests", async () => {
    const KyberLiteBase = await ethers.getContractFactory("KyberLiteBase");
    const kyberLiteBase = await KyberLiteBase.deploy();

    await kyberLiteBase.deployed();

    const daiBefore = await daiContract.balanceOf(wallet.getAddress());

    const { expectedRate } = await kyberNetworkContract.getExpectedRate(
      erc20.eth.address,
      erc20.dai.address,
      parseEther(`${ethToSwap}`),
    );

    const expectedDai = expectedRate.mul(bigNumberify(`${ethToSwap}`));

    await kyberLiteBase.ethToToken(erc20.dai.address, {
      value: parseEther(`${ethToSwap}`),
      gasLimit: 4000000,
    });

    const daiAfter: BigNumber = await daiContract.balanceOf(
      wallet.getAddress(),
    );

    expect(parseFloat(fromWei(daiAfter))).to.be.approximately(
      parseFloat(fromWei(daiBefore.add(expectedDai))),
      0.1,
    );
  });
});
