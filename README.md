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

## Web3.js
```javascript
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:8545");
const accounts = await web3.eth.getAccounts();

const { getLegosFor, networks } = require("@studydefi/money-legos");
const legos = getLegosFor(networks.mainnet);

const daiContract = new web3.eth.Contract(
  legos.erc20.contracts.dai.address,
  legos.erc20.contracts.abi,
  { from: accounts[0] }
);

const main = async () => {
  const balWei = await daiContract
    .balanceOf("0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae")
    .call();
  console.log(`Balance of EF: ${balWei}`);
};

main();
```

## Ethers.js
```javascript
const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider();

const { getLegosFor, networks } = require("@studydefi/money-legos");
const legos = getLegosFor(networks.mainnet);

const daiContract = new ethers.Contract(
  legos.erc20.contracts.abi,
  legos.erc20.contracts.dai.address,
  provider
);

const main = async () => {
  const balWei = await daiContract.balanceOf(
    "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae"
  );
  const bal = ethers.utils.formatEther(balWei);
  console.log(`Balance of EF: ${bal.toString()}`);
};

main();
```