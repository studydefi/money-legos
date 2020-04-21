# Aave

## Flashloans

_Special thanks to [mrdavey](https://github.com/mrdavey/) for his [ez-flashloan example](https://github.com/mrdavey/ez-flashloan)._

Flashloans are a bit tricky as they require you deploy a smart contract before you can start ultilizing it. The current standard way to interact with flashloans is by:
1. Deploying a smart contract with specific logic that will return you a profit (e.g. arbitrage, liquidating acounts).
2. Interacting with the application specific smart contract from step 1.

One thing to note about flashloan supported smart contracts is that they can get big very fast, especially when you're interacting with multiple protocols (e.g. Uniswap, 1split, curvefi, compound, maker, etc). Additionally, if you're not structuring your smart contract in a modular format, you might hit the contract gas size limit (~8 million as of 2020 April). Fortunately, you can ultilize [proxy contracts (EIP 1822)](https://eips.ethereum.org/EIPS/eip-1822) in conjunction with some clever data encoding to "generalize" flashloans and separate out the defi protocol libraries from the flashloan logic. Generalizing flashloans is a bit out of scope for this integration example, however you can [check out the example repo here](https://github.com/kendricktan/generalized-aave-flashloans).

### Flashloan Logic (Solidity)

Your smart contract will need to inherit from `FlashLoanReceiverBase` and have two functions:
1. An entrypoint function where __you__ call to initiate the flashloan (`initateFlashLoan` in the example below).
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
  wallet
);

const main = async () => {
  // Encoding our custom data
  const myCustomDataEncoded = ethers.utils.defaultAbiCoder.encode(
    ["address", "uint"],
    ["0x0000000000000000000000000000000000000000", 42]
  );

  const tx = await contractWithFlashLoan.initateFlashLoan(
    contractWithFlashLoanAddress, // The callback function is located in the same contract
    legos.erc20.dai.address, // We would like to loan DAI
    ethers.utils.parseEther("1"), // We would like to loan 1 DAI in 18 decimals
    myCustomDataEncoded, // _params encoded
    {
      gasLimit: 4000000,
    }
  );
  await tx.wait();
};
```