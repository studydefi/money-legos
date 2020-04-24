# Quickstart

## Install

```bash
npm install @studydefi/money-legos
```

## Javascript Usage

First import the module:

```js
import { legos } from "@studydefi/money-legos";
```

Navigate the JSON tree full of ABIs and addresses:

```js
// protocols
legos.uniswap.factory.abi;
legos.uniswap.factory.address;

// erc20 tokens
legos.erc20.abi;
legos.erc20.dai.address;
```

You can also import specific protocols:

```js
// import only the protocol you are interested in
import uniswap from "@studydefi/money-legos/uniswap";

uniswap.factory.abi;
uniswap.factory.address;
```

## Solidity Usage

```js
pragma solidity ^0.5.0;

import "@studydefi/money-legos/onesplit/contracts/IOneSplit.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract OneSplitSwapper {
    // Uniswap Mainnet factory address
    address constant OneSplitAddress = 0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E;

    function _swap(address from, address to, uint256 amountWei) internal {
        IERC20 fromIERC20 = IERC20(from);
        IERC20 toIERC20 = IERC20(to);

        (uint256 returnAmount, uint256[] memory distribution) = IOneSplit(
            OneSplitAddress
        ).getExpectedReturn(
            fromIERC20,
            toIERC20,
            amountWei,
            10,
            0
        );

        IOneSplit(OneSplitAddress).swap(
            fromIERC20,
            toIERC20,
            amountWei,
            returnAmount,
            distribution,
            0
        );
    }
}
```
