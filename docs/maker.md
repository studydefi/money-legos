# Maker

By default, Maker uses [proxy contracts (EIP 1822)](https://eips.ethereum.org/EIPS/eip-1822) to keep track of your vaults.

You'll need to [perform a deletecall](https://ethereum.stackexchange.com/a/3672) to Maker's "managers" (contracts where the underlying logic lives, e.g. [DssProxyActions](0x82ecd135dce65fbc6dbdd0e4237e0af93ffd5038)). As such, you'll need to create a proxy on Maker's [Proxy Registry](https://etherscan.io/address/0x4678f0a6958e4D2Bc4F1BAF7Bc52E8F3564f3fE4) before you can start automating your vaults.

Unfortunately Maker has a tendency to name things unintuitively, go through the [Maker glossary](https://docs.makerdao.com/other-documentation/system-glossary#general) or [MuchClearerDAI](https://github.com/alexvansande/MuchClearerDAI) to make sense of terminologies like `flip`, `flop`, `flap`, `gem`, etc.

## Interface

### IDssProxyActions
```javascript
pragma solidity ^0.5.0;

contract IDssProxyActions{
    function cdpAllow(address manager,uint256 cdp,address usr,uint256 ok) external;
    function daiJoin_join(address apt,address urn,uint256 wad) external;
    function draw(address manager,address jug,address daiJoin,uint256 cdp,uint256 wad) external;
    function enter(address manager,address src,uint256 cdp) external;
    function ethJoin_join(address apt,address urn) external;
    function exitETH(address manager,address ethJoin,uint256 cdp,uint256 wad) external;
    function exitGem(address manager,address gemJoin,uint256 cdp,uint256 wad) external;
    function flux(address manager,uint256 cdp,address dst,uint256 wad) external;
    function freeETH(address manager,address ethJoin,uint256 cdp,uint256 wad) external;
    function freeGem(address manager,address gemJoin,uint256 cdp,uint256 wad) external;
    function frob(address manager,uint256 cdp,int256 dink,int256 dart) external;
    function gemJoin_join(address apt,address urn,uint256 wad,bool transferFrom) external;
    function give(address manager,uint256 cdp,address usr) external;
    function giveToProxy(address proxyRegistry,address manager,uint256 cdp,address dst) external;
    function hope(address obj,address usr) external;
    function lockETH(address manager,address ethJoin,uint256 cdp) external;
    function lockETHAndDraw(address manager,address jug,address ethJoin,address daiJoin,uint256 cdp,uint256 wadD) external;
    function lockGem(address manager,address gemJoin,uint256 cdp,uint256 wad,bool transferFrom) external;
    function lockGemAndDraw(address manager,address jug,address gemJoin,address daiJoin,uint256 cdp,uint256 wadC,uint256 wadD,bool transferFrom) external;
    function makeGemBag(address gemJoin) external returns (address bag);
    function move(address manager,uint256 cdp,address dst,uint256 rad) external;
    function nope(address obj,address usr) external;
    function open(address manager,bytes32 ilk,address usr) external returns (uint256 cdp);
    function openLockETHAndDraw(address manager,address jug,address ethJoin,address daiJoin,bytes32 ilk,uint256 wadD) external returns (uint256 cdp);
    function openLockGNTAndDraw(address manager,address jug,address gntJoin,address daiJoin,bytes32 ilk,uint256 wadC,uint256 wadD) external returns (address bag,uint256 cdp);
    function openLockGemAndDraw(address manager,address jug,address gemJoin,address daiJoin,bytes32 ilk,uint256 wadC,uint256 wadD,bool transferFrom) external returns (uint256 cdp);
    function quit(address manager,uint256 cdp,address dst) external;
    function safeLockETH(address manager,address ethJoin,uint256 cdp,address owner) external;
    function safeLockGem(address manager,address gemJoin,uint256 cdp,uint256 wad,bool transferFrom,address owner) external;
    function safeWipe(address manager,address daiJoin,uint256 cdp,uint256 wad,address owner) external;
    function safeWipeAll(address manager,address daiJoin,uint256 cdp,address owner) external;
    function shift(address manager,uint256 cdpSrc,uint256 cdpOrg) external;
    function transfer(address gem,address dst,uint256 wad) external;
    function urnAllow(address manager,address usr,uint256 ok) external;
    function wipe(address manager,address daiJoin,uint256 cdp,uint256 wad) external;
    function wipeAll(address manager,address daiJoin,uint256 cdp) external;
    function wipeAllAndFreeETH(address manager,address ethJoin,address daiJoin,uint256 cdp,uint256 wadC) external;
    function wipeAllAndFreeGem(address manager,address gemJoin,address daiJoin,uint256 cdp,uint256 wadC) external;
    function wipeAndFreeETH(address manager,address ethJoin,address daiJoin,uint256 cdp,uint256 wadC,uint256 wadD) external;
    function wipeAndFreeGem(address manager,address gemJoin,address daiJoin,uint256 cdp,uint256 wadC,uint256 wadD) external;
}
```

## Examples (JavaScript)

### Creating A Proxy

```javascript
const main = async () => {
  const proxyRegistry = new ethers.Contract(
    legos.maker.contracts.proxyRegistry.address,
    legos.maker.contracts.proxyRegistry.abi,
    wallet
  );

  await proxyRegistry.build({ gasLimit: 1500000 });
  const proxyAddress = await proxyRegistry.proxies(wallet.address);

  console.log(`Proxy address: ${proxyAddress}`);
};
```

### Opening A Vault

The example below will open a new vault, collateralize 1 ETH and take out 20 DAI debt

```javascript
const newTokenContract = (address) =>
  new ethers.Contract(address, legos.erc20.contracts.abi, wallet);

const main = async () => {
  const proxyRegistry = new ethers.Contract(
    legos.maker.contracts.proxyRegistry.address,
    legos.maker.contracts.proxyRegistry.abi,
    wallet
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
    legos.dappsys.contracts.dsProxy.abi,
    wallet
  );

  // Perpares teh data for delegate call
  const IDssProxyActions = new ethers.utils.Interface(
    legos.maker.contracts.dssProxyActions.abi
  );

  const _data = IDssProxyActions.functions.openLockETHAndDraw.encode([
    legos.maker.contracts.dssCdpManager.address,
    legos.maker.contracts.jug.address,
    legos.maker.ilks.ethA.join.address,
    legos.maker.contracts.daiJoin.address,
    ethers.utils.formatBytes32String(legos.maker.ilks.ethA.symbol),
    ethers.utils.parseUnits("20", legos.erc20.contracts.dai.decimals),
  ]);

  // Open vault through proxy
  await proxyContract.execute(
    legos.maker.contracts.dssProxyActions.address,
    _data,
    {
      gasLimit: 2500000,
      value: ethers.utils.parseEther("1"),
    }
  );

  const daiBalance = await newTokenContract(
    legos.erc20.contracts.dai.address
  ).balanceOf(wallet.address);

  console.log(
    `DAI Balance: ${ethers.utils.formatEther(daiBalance.toString())}`
  );
};
```

## Example (Solidity)

Due to the way Maker has constructed its logic, if you would like to create a contract that does an action, e.g. open a vault, lock up 1 ETH and draw 20 DAI, you can't just call `DSSProxyAction`. You'll have to re-implement the logic into your contract itself.

Fortunately, the primitives are well written in [DssProxyActions.sol](https://github.com/makerdao/dss-proxy-actions/blob/master/src/DssProxyActions.sol).

### Opening A Vault

```solidity
pragma solidity ^0.5.0;

import "@studydefi/money-legos/src/maker/contracts/DssProxyActionsBase.sol";


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

To execute the contract, you'll need to perform the delegate-call via proxy, just like the JavaScript example of opening a vault. But this time, instead of using `legos.maker.contracts.dssProxyActions.abi` as the abi for interface encoding, you'll need to supply your contract's abi (in this example it's `MyCustomVaultManager`), and change the encoding function from `openLockETHAndDraw` to your newly defined function (in this example it's `myCustomOpenVaultFunction`).

Note that you don't need to redeploy a proxy registry / proxy contract to make it work with your new `MyCustomVaultManager` contract and can simply use your existing Maker proxy.