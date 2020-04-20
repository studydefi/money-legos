# Quickstart

`money-legos` help you quickly build your next Defi dapp in no time:

- Typescript-powered auto-complete
- ABIs and addresses to the following protocols and standards
  - AAVE
  - Compound
  - Curve Finance
  - DappSys
  - DyDx
  - ERC20
  - MakerDAO
  - OneSplit
  - Uniswap v1

## Install

```bash
npm install @studydefi/money-legos
```

or 

```bash
yarn add @studydefi/money-legos
```

## Usage

### JavaScript

```javascript
import { legos } from "@studydefi/money-legos";

// access ABIs and addresses
legos.erc20.abi;
legos.erc20.dai.address;

// of many popular DeFi protocols
legos.uniswap.factory.abi;
legos.uniswap.factory.address;

// import only the protocol you are interested in
import uniswap from "@studydefi/money-legos/uniswap";

uniswap.factory.abi;
uniswap.factory.address;
```

### Solidity

```solidity
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

# Documentation

Documentation and integration examples at https://money-legos.studydefi.com/
