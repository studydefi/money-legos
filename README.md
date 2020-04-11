# Money-legos

Quickstart your journey into building DeFi DApps!

`money-legos` is an NPM package that provides you with both the ABI and the addresses needed for you to quickly and rapidly build your Defi Dapp.

Currently the package includes ABI and mainnet addresses from:
- ERC20 tokens (e.g. DAI, REP, USDC, etc)
- MakerDAO
- Uniswap
- Compound

... and more coming soon!

# Getting Started

## Quickstart
```bash
npm install @studydefi/money-legos
```

```javascript
const { getLegosFor, networks } = require('@studydefi/money-legos')
const legos = getLegosFor(networks.mainnet)
```

# Documentation
Documentation is hosted at https://money-legos.studydefi.github.io/