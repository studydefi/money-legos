jest.setTimeout(100000);

import { Wallet, Contract, ethers } from "ethers";
import { fromWei } from "./utils";

// import legos
import erc20 from "../src/erc20";
import maker from "../src/maker";
import dappsys from "../src/dappsys";

describe("maker", () => {
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

  test("create a proxy on Maker", async () => {
    const proxyRegistry = new ethers.Contract(
      maker.contracts.proxyRegistry.address,
      maker.contracts.proxyRegistry.abi,
      wallet,
    );

    const before = await proxyRegistry.proxies(wallet.address);

    await proxyRegistry.build({ gasLimit: 1500000 });

    const after = await proxyRegistry.proxies(wallet.address);

    expect(before).toBe("0x0000000000000000000000000000000000000000");
    expect(after).toBe("0x4EA44929b2E69Ab14Fd131F59D317B82322E5844");
  });

  test("open Vault on Maker", async () => {
    const proxyRegistry = new ethers.Contract(
      maker.contracts.proxyRegistry.address,
      maker.contracts.proxyRegistry.abi,
      wallet,
    );

    // Build proxy if we don't have one
    let proxyAddress = await proxyRegistry.proxies(wallet.address);
    if (proxyAddress === "0x0000000000000000000000000000000000000000") {
      await proxyRegistry.build({ gasLimit: 1500000 });
      proxyAddress = await proxyRegistry.proxies(wallet.address);
    }

    // Note: MakerDAO uses dappsys's DSProxy
    const proxyContract = new ethers.Contract(
      proxyAddress,
      dappsys.contracts.dsProxy.abi,
      wallet,
    );

    // Prepare data for delegate call
    const IDssProxyActions = new ethers.utils.Interface(
      maker.contracts.dssProxyActions.abi,
    );

    const _data = IDssProxyActions.functions.openLockETHAndDraw.encode([
      maker.contracts.dssCdpManager.address,
      maker.contracts.jug.address,
      maker.contracts.ethAJoin.address,
      maker.contracts.daiJoin.address,
      ethers.utils.formatBytes32String(maker.ilks.ethA.symbol),
      ethers.utils.parseUnits("20", erc20.contracts.dai.decimals),
    ]);

    const ethBefore = await await wallet.getBalance();
    const daiBefore = await daiContract.balanceOf(wallet.address);

    // Open vault through proxy
    await proxyContract.execute(
      maker.contracts.dssProxyActions.address,
      _data,
      {
        gasLimit: 2500000,
        value: ethers.utils.parseEther("1"),
      },
    );

    const ethAfter = await await wallet.getBalance();
    const daiAfter = await daiContract.balanceOf(wallet.address);

    const ethSpent = parseFloat(fromWei(ethBefore.sub(ethAfter)));
    const daiGained = parseFloat(fromWei(daiAfter.sub(daiBefore)));

    expect(ethSpent).toBeCloseTo(1);
    expect(daiGained).toBeCloseTo(20);
  });
});
