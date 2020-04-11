# Uniswap

```javascript
const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider();

const { getLegosFor, networks } = require("@studydefi/money-legos");

const legos = getLegosFor(networks.mainnet);

const uniswapFactory = new ethers.Contract(
    legos.uniswap.contracts.factory.address,
  legos.uniswap.contracts.factory.abi,
  provider
);

const main = async () => {
  const daiExchangeAddress = await uniswapFactory.getExchange(
    legos.erc20.contracts.dai.address
  );

  const daiExchange = new ethers.Contract(
      daiExchangeAddress,
      legos.uniswap.contracts.exchange.abi,
      provider
  )
};

main();
```