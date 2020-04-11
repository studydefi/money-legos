# Money-legos
[![CircleCI](https://circleci.com/gh/studydefi/money-legos.svg?style=svg)](https://circleci.com/gh/studydefi/money-legos)

Quickstart your journey into building DeFi DApps!

`money-legos` is an NPM package that provides you with both the ABI and the addresses needed for you to quickly and rapidly build your Defi Dapp.

Currently the package includes ABI and mainnet addresses from:
- ERC20 tokens (e.g. DAI, REP, USDC, etc)
- MakerDAO
- Uniswap
- Compound

... and more coming soon!

# Quickstart

## Install
```bash
npm install @studydefi/money-legos
```

## Usage
```javascript
const { getLegosFor, networks } = require('@studydefi/money-legos')
const legos = getLegosFor(networks.mainnet)

// Access ABIs and addresses

// legos.erc20.contracts.dai.address
// legos.erc20.contracts.dai.abi

// legos.uniswap.contracts.factory.abi
// legos.uniswap.contracts.factory.address
```

# Documentation
Documentation is hosted at https://money-legos.studydefi.com/