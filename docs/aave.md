# Aave

## Flashloans

_Special thanks to [mrdavey](https://github.com/mrdavey/) for his [ez-flashloan example](https://github.com/mrdavey/ez-flashloan)._

Flashloans are a bit tricky as they require you deploy a smart contract before you can start ultilizing it. The current standard way to interact with flashloans is by:

1. Deploying a smart contract with specific logic that will return you a profit (e.g. arbitrage, liquidating acounts).
2. Interacting with the application specific smart contract from step 1.

One thing to note about flashloan supported smart contracts is that they can get big very fast, especially when you're interacting with multiple protocols (e.g. Uniswap, 1split, curvefi, compound, maker, etc). Additionally, if you're not structuring your smart contract in a modular format, you might hit the contract gas size limit (~8 million as of 2020 April). Fortunately, you can ultilize [proxy contracts (EIP 1822)](https://eips.ethereum.org/EIPS/eip-1822) in conjunction with some clever data encoding to "generalize" flashloans and separate out the defi protocol libraries from the flashloan logic. Generalizing flashloans is a bit out of scope for this integration example, however you can [check out the example repo here](https://github.com/kendricktan/generalized-aave-flashloans).

### Flashloan Logic (Solidity)

Your smart contract will need to inherit from `FlashLoanReceiverBase` and have two functions:

1. An entrypoint function where **you** call to initiate the flashloan (`initateFlashLoan` in the example below).
2. A callback function called `executeOperation` that contains the action logic to perform once the loan is given to us.

```js
// ../tests/aave.test.sol

pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@studydefi/money-legos/aave/contracts/ILendingPool.sol";
import "@studydefi/money-legos/aave/contracts/IFlashLoanReceiver.sol";
import "@studydefi/money-legos/aave/contracts/FlashloanReceiverBase.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ContractWithFlashLoan is FlashLoanReceiverBase {
    address constant AaveLendingPoolAddressProviderAddress = 0x24a42fD28C976A61Df5D00D0599C34c4f90748c8;

    struct MyCustomData {
        address a;
        uint b;
    }

    function executeOperation(
        address _reserve,
        uint _amount,
        uint _fee,
        bytes calldata _params
    ) external {
        // You can pass in some byte-encoded params
        MyCustomData memory myCustomData = abi.decode(_params, (MyCustomData));
        // myCustomData.a

        // Function is called when loan is given to contract
        // Do your logic here, e.g. arbitrage, liquidate compound, etc
        // Note that if you don't do your logic, it WILL fail

        // TODO: Change line below
        revert("Hello, you haven't implemented your flashloan logic");

        transferFundsBackToPoolInternal(_reserve, _amount.add(_fee));
    }

    // Entry point
    function initateFlashLoan(
        address contractWithFlashLoan,
        address assetToFlashLoan,
        uint amountToLoan,
        bytes calldata _params
    ) external {
        // Get Aave lending pool
        ILendingPool lendingPool = ILendingPool(
            ILendingPoolAddressesProvider(AaveLendingPoolAddressProviderAddress)
                .getLendingPool()
        );

        // Ask for a flashloan
        // LendingPool will now execute the `executeOperation` function above
        lendingPool.flashLoan(
            contractWithFlashLoan, // Which address to callback into, alternatively: address(this)
            assetToFlashLoan,
            amountToLoan,
            _params
        );
    }
}
```

### Flashloan Initiation (JavaScript)

Before you can initiate flashloans, you first need to deploy you flashloan smart contract (e.g. the one above). You'll also need to encode the data `_params` to give more information to your callback function `executeOperation` on what it should do. i.e. What vault should it liquidate? Which two tokens to arbitrage on, and which DEX should the arbitrage be performed on?

According the smart contract example provided above, the data we would like to encode for `_params` is `MyCustomData`.

```js
// You don't need truffle artifacts as long as you have a way to retrieve
// the address and abi of the deployed contract nicely
const ContractWithFlashLoanArtifact = require("./build/contracts/ContractWithFlashLoan.json");

const contractWithFlashLoanAddress =
  ContractWithFlashLoanArtifact.networks["1"].address;

const contractWithFlashLoan = new ethers.Contract(
  contractWithFlashLoanAddress,
  ContractWithFlashLoanArtifact.abi,
  wallet,
);

const main = async () => {
  // Encoding our custom data
  const myCustomDataEncoded = ethers.utils.defaultAbiCoder.encode(
    ["address", "uint"],
    ["0x0000000000000000000000000000000000000000", 42],
  );

  const tx = await contractWithFlashLoan.initateFlashLoan(
    contractWithFlashLoanAddress, // The callback function is located in the same contract
    legos.erc20.dai.address, // We would like to loan DAI
    ethers.utils.parseEther("1"), // We would like to loan 1 DAI in 18 decimals
    myCustomDataEncoded, // _params encoded
    {
      gasLimit: 4000000,
    },
  );
  await tx.wait();
};
```

## Examples (JavaScript)

### Supplying/Borrowing Tokens

```js
// ../tests/aave.test.ts#L43-L62

test("lend 10 ETH (i.e. mint aETH)", async () => {
  // given
  const ethToLend = 10;
  const before = await aEthContract.balanceOf(wallet.address);

  // when
  const { address: reserveAddress } = erc20.eth;
  const amount = parseEther(ethToLend.toString());
  const referralCode = "0";
  await lendingPool.deposit(reserveAddress, amount, referralCode, {
    gasLimit: 1500000,
    value: amount,
  });

  // then
  const after = await aEthContract.balanceOf(wallet.address);

  const ethLended = parseFloat(fromWei(after.sub(before)));
  expect(ethLended).toBeCloseTo(ethToLend);
});
```

```js
// ../tests/aave.test.ts#L64-L85

test("borrow 20 DAI", async () => {
  // given
  const before = await daiContract.balanceOf(wallet.address);

  // when
  const { address: reserveAddress } = erc20.dai;
  const amount = parseEther("20");
  const interestRateMode = 1; // 1 = STABLE RATE, 2 = VARIABLE RATE
  const referralCode = "0";
  await lendingPool.borrow(
    reserveAddress,
    amount,
    interestRateMode,
    referralCode,
    { gasLimit: 1500000 },
  );

  // then
  const after = await daiContract.balanceOf(wallet.address);
  const daiBorrowed = parseFloat(fromWei(after.sub(before)));
  expect(daiBorrowed).toBe(20);
});
```

### Retrieve Supply/Borrow Balance

```js
// ../tests/aave.test.ts#L111-L121

test("get supply/borrow balances for DAI", async () => {
  // when
  const {
    currentATokenBalance: daiLended,
    currentBorrowBalance: daiBorrowed,
  } = await lendingPool.getUserReserveData(erc20.dai.address, wallet.address);

  // then
  expect(parseFloat(fromWei(daiBorrowed))).toBeCloseTo(20);
  expect(parseFloat(fromWei(daiLended))).toBeCloseTo(5);
});
```

### Withdraw Supply

```js
// ../tests/aave.test.ts#L123-L139

test("withdraw 1 ETH from collateral", async () => {
  // given
  const ethBefore = await wallet.getBalance();
  const ethToRedeem = 1;
  const ethToRedeemInWei = parseEther(ethToRedeem.toString());

  // when
  await aEthContract.redeem(ethToRedeemInWei, {
    gasLimit: 1500000,
  });

  // then
  const ethAfter = await wallet.getBalance();

  const ethGained = parseFloat(fromWei(ethAfter.sub(ethBefore)));
  expect(ethGained).toBeCloseTo(ethToRedeem, 1);
});
```

### Repay Debt

```js
// ../tests/aave.test.ts#L141-L165

test("repay 1 DAI of debt", async () => {
  // given
  const daiToRepay = 1;
  const daiToRepayInWei = parseEther(daiToRepay.toString());

  const daiBefore = await daiContract.balanceOf(wallet.address);

  // when
  await daiContract.approve(aave.LendingPoolCore.address, daiToRepayInWei);

  await lendingPool.repay(
    erc20.dai.address,
    daiToRepayInWei,
    wallet.address,
    {
      gasLimit: 1500000,
    },
  );

  // then
  const daiAfter = await daiContract.balanceOf(wallet.address);

  const daiSpent = parseFloat(fromWei(daiBefore.sub(daiAfter)));
  expect(daiSpent).toBe(daiToRepay);
});
```

### Retrieve Health Factor

The health factor should be > 1 otherwise the user's positions can be liquidated.
See more: https://docs.aave.com/developers/developing-on-aave/the-protocol/lendingpool#liquidationcall

```js
// ../tests/aave.test.ts#L167-L175

test("retrieve current health factor", async () => {
  // when
  const { healthFactor } = await lendingPool.getUserAccountData(
    wallet.address,
  );

  // then
  expect(parseFloat(fromWei(healthFactor))).toBeGreaterThan(1);
});
```
