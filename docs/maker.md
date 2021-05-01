# Maker

By default, Maker uses [proxy contracts (EIP 1822)](https://eips.ethereum.org/EIPS/eip-1822) to keep track of your vaults.

You'll need to [perform a deletecall](https://ethereum.stackexchange.com/a/3672) to Maker's "managers" (contracts where the underlying logic lives, e.g. [DssProxyActions](0x82ecd135dce65fbc6dbdd0e4237e0af93ffd5038)). As such, you'll need to create a proxy on Maker's [Proxy Registry](https://etherscan.io/address/0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4) before you can start automating your vaults.

Unfortunately Maker has a tendency to name things unintuitively, go through the [Maker glossary](https://docs.makerdao.com/other-documentation/system-glossary#general) or [MuchClearerDAI](https://github.com/alexvansande/MuchClearerDAI) to make sense of terminologies like `flip`, `flop`, `flap`, `gem`, etc.

## Interface

### IDssProxyActions

```js
// ../src/maker/contracts/IDssProxyActions.sol#L149-L351

contract IDssProxyActions {
    function cdpAllow(address manager, uint256 cdp, address usr, uint256 ok)
        external;

    function daiJoin_join(address apt, address urn, uint256 wad) external;

    function draw(
        address manager,
        address jug,
        address daiJoin,
        uint256 cdp,
        uint256 wad
    ) external;

    function enter(address manager, address src, uint256 cdp) external;

    function ethJoin_join(address apt, address urn) external;

    function exitETH(address manager, address ethJoin, uint256 cdp, uint256 wad)
        external;

    function exitGem(address manager, address gemJoin, uint256 cdp, uint256 wad)
        external;

    function flux(address manager, uint256 cdp, address dst, uint256 wad)
        external;

    function freeETH(address manager, address ethJoin, uint256 cdp, uint256 wad)
        external;

    function freeGem(address manager, address gemJoin, uint256 cdp, uint256 wad)
        external;

    function frob(address manager, uint256 cdp, int256 dink, int256 dart)
        external;

    function gemJoin_join(
        address apt,
        address urn,
        uint256 wad,
        bool transferFrom
    ) external;

    function give(address manager, uint256 cdp, address usr) external;

    function giveToProxy(
        address proxyRegistry,
        address manager,
        uint256 cdp,
        address dst
    ) external;

    function hope(address obj, address usr) external;

    function lockETH(address manager, address ethJoin, uint256 cdp) external;

    function lockETHAndDraw(
        address manager,
        address jug,
        address ethJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadD
    ) external;

    function lockGem(
        address manager,
        address gemJoin,
        uint256 cdp,
        uint256 wad,
        bool transferFrom
    ) external;

    function lockGemAndDraw(
        address manager,
        address jug,
        address gemJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadC,
        uint256 wadD,
        bool transferFrom
    ) external;

    function makeGemBag(address gemJoin) external returns (address bag);

    function move(address manager, uint256 cdp, address dst, uint256 rad)
        external;

    function nope(address obj, address usr) external;

    function open(address manager, bytes32 ilk, address usr)
        external
        returns (uint256 cdp);

    function openLockETHAndDraw(
        address manager,
        address jug,
        address ethJoin,
        address daiJoin,
        bytes32 ilk,
        uint256 wadD
    ) external returns (uint256 cdp);

    function openLockGNTAndDraw(
        address manager,
        address jug,
        address gntJoin,
        address daiJoin,
        bytes32 ilk,
        uint256 wadC,
        uint256 wadD
    ) external returns (address bag, uint256 cdp);

    function openLockGemAndDraw(
        address manager,
        address jug,
        address gemJoin,
        address daiJoin,
        bytes32 ilk,
        uint256 wadC,
        uint256 wadD,
        bool transferFrom
    ) external returns (uint256 cdp);

    function quit(address manager, uint256 cdp, address dst) external;

    function safeLockETH(
        address manager,
        address ethJoin,
        uint256 cdp,
        address owner
    ) external;

    function safeLockGem(
        address manager,
        address gemJoin,
        uint256 cdp,
        uint256 wad,
        bool transferFrom,
        address owner
    ) external;

    function safeWipe(
        address manager,
        address daiJoin,
        uint256 cdp,
        uint256 wad,
        address owner
    ) external;

    function safeWipeAll(
        address manager,
        address daiJoin,
        uint256 cdp,
        address owner
    ) external;

    function shift(address manager, uint256 cdpSrc, uint256 cdpOrg) external;

    function transfer(address gem, address dst, uint256 wad) external;

    function urnAllow(address manager, address usr, uint256 ok) external;

    function wipe(address manager, address daiJoin, uint256 cdp, uint256 wad)
        external;

    function wipeAll(address manager, address daiJoin, uint256 cdp) external;

    function wipeAllAndFreeETH(
        address manager,
        address ethJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadC
    ) external;

    function wipeAllAndFreeGem(
        address manager,
        address gemJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadC
    ) external;

    function wipeAndFreeETH(
        address manager,
        address ethJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadC,
        uint256 wadD
    ) external;

    function wipeAndFreeGem(
        address manager,
        address gemJoin,
        address daiJoin,
        uint256 cdp,
        uint256 wadC,
        uint256 wadD
    ) external;
}
```

## Examples (JavaScript)

### Reading ETH price from the Medianizer

```js
// ../tests/medianizer.test.ts#L19-L31

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
```

### Creating A Proxy

```js
// ../tests/maker.test.ts#L22-L37

test("create a proxy on Maker", async () => {
  const proxyRegistry = new ethers.Contract(
    maker.proxyRegistry.address,
    maker.proxyRegistry.abi,
    wallet,
  );

  const before = await proxyRegistry.proxies(wallet.address);

  await proxyRegistry.build({ gasLimit: 1500000 });

  const after = await proxyRegistry.proxies(wallet.address);

  expect(before).toBe("0x0000000000000000000000000000000000000000");
  expect(after).not.toBe("0x0000000000000000000000000000000000000000");
});
```

### Opening A Vault

Note that the attempt to mint smaller DAI amounts can be reverted due to high gas fees.
The example below will open a new vault, collateralize 10 ETH and take out 10000 DAI debt.

```js
// ../tests/maker.test.ts#L39-L91

test("open Vault on Maker", async () => {
  const proxyRegistry = new ethers.Contract(
    maker.proxyRegistry.address,
    maker.proxyRegistry.abi,
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
    dappsys.dsProxy.abi,
    wallet,
  );

  // Prepare data for delegate call
  const IDssProxyActions = new ethers.utils.Interface(
    maker.dssProxyActions.abi,
  );

  const _data = IDssProxyActions.functions.openLockETHAndDraw.encode([
    maker.dssCdpManager.address,
    maker.jug.address,
    maker.ethAJoin.address,
    maker.daiJoin.address,
    ethers.utils.formatBytes32String(maker.ethA.symbol),
    ethers.utils.parseUnits("10000", erc20.dai.decimals),
  ]);

  const ethBefore = await wallet.getBalance();
  const daiBefore = await daiContract.balanceOf(wallet.address);

  // Open vault through proxy
  await proxyContract.execute(maker.dssProxyActions.address, _data, {
    gasLimit: 2500000,
    value: ethers.utils.parseEther("10"),
  });

  const ethAfter = await wallet.getBalance();
  const daiAfter = await daiContract.balanceOf(wallet.address);

  const ethSpent = parseFloat(fromWei(ethBefore.sub(ethAfter)));
  const daiGained = parseFloat(fromWei(daiAfter.sub(daiBefore)));

  expect(ethSpent).toBeCloseTo(1, 1);
  expect(daiGained).toBeCloseTo(20);
});
```

## Example (Solidity)

Due to the way Maker has constructed its logic, if you would like to create a contract that does an action, e.g. open a vault, lock up 10 ETH and draw 10000 DAI, you can't just call `DSSProxyAction`. You'll have to re-implement the logic into your contract itself.

Fortunately, the primitives are well written in [DssProxyActions.sol](https://github.com/makerdao/dss-proxy-actions/blob/master/src/DssProxyActions.sol).

### Opening A Vault

```js
pragma solidity ^0.5.0;

import "@studydefi/money-legos/maker/contracts/DssProxyActionsBase.sol";


contract MyCustomVaultManager is DssProxyActionsBase {
    // Referenced from
    // https://github.com/makerdao/dss-proxy-actions/blob/968b5030523af74d786520a9a664b31fa811c05c/src/DssProxyActions.sol#L583
    function myCustomOpenVaultFunction(
        address manager,
        address jug,
        address ethJoin,
        address daiJoin,
        uint wadD
    ) public payable {
        // Opens ETH-A CDP
        bytes32 ilk = bytes32("ETH-A");
        uint cdp = open(manager, ilk, address(this));

        address urn = ManagerLike(manager).urns(cdp);
        address vat = ManagerLike(manager).vat();
        // Receives ETH amount, converts it to WETH and joins it into the vat
        ethJoin_join(ethJoin, urn);
        // Locks WETH amount into the CDP and generates debt
        frob(manager, cdp, toInt(msg.value), _getDrawDart(vat, jug, urn, ilk, wadD));
        // Moves the DAI amount (balance in the vat in rad) to proxy's address
        move(manager, cdp, address(this), toRad(wadD));
        // Allows adapter to access to proxy's DAI balance in the vat
        if (VatLike(vat).can(address(this), address(daiJoin)) == 0) {
            VatLike(vat).hope(daiJoin);
        }

        // Exits DAI to the user's wallet as a token
        DaiJoinLike(daiJoin).exit(msg.sender, wadD);
    }
}

```

After `MyCustomVaultManager` migration, DAI can be minted by calling filled with arguments `myCustomOpenVaultFunction`

```js
    // source: https://github.com/xternet/mint_dai/blob/master/scripts/mint_dai_via_contract.js

    await MyCustomVaultManager.myCustomOpenVaultFunction(
      legos.maker.dssCdpManager.address,
      legos.maker.jug.address,
      legos.maker.ethAJoin.address,
      legos.maker.daiJoin.address,
      ethers.utils.parseUnits("10000", legos.erc20.dai.decimals),
      { gasLimit: 2500000, value: ethers.utils.parseEther("10") },
    )
```
