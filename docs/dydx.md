# DyDx

## Flashloans On DyDx

_Special thanks to [kollateral](http://github.com/kollateral/kollateral/) for open sourcing their implementation._

DyDx [does not natively have a "flashloan" feature](https://help.dydx.exchange/en/articles/3724602-flash-loans). However you can achieve a similar behavior by executing a series of operations on the [SoloMargin contract](https://etherscan.io/address/0x1e0447b19bb6ecfdae1e4ae1694b0c3659614e4e). In order mimic an Aave flashloan on DyDx, you would need to:

1. Borrow `x` amount of tokens. ([Withdraw](https://docs.dydx.exchange/#/protocol?id=withdraw))
2. Call a function (i.e. Logic to handle flashloaned funds). ([Call](https://docs.dydx.exchange/#/protocol?id=call))
3. Deposit back `x` (+2 wei) amount of tokens. ([Deposit](https://docs.dydx.exchange/#/protocol?id=deposit))

All within one transaction. The reason this works is because DyDx natively has this feature called [operate](https://docs.dydx.exchange/#/protocol?id=operations) which allows you to execute __a series of operations without checking if the state is valid until the final step__. That means that you can withdraw as much funds as you like, do anything with it, as long as you deposit back the funds (and have ~2 Wei of assets in your account) within the same transaction.

Note that doing a flashloan in DyDx is similar to that of doing it in Aave, you'll need to:

1. Deploy a smart contract with specific logic to handle flashloaned asset.
2. Interact with the smart contract deployed from step 1.

### Flashloan Logic (Solidity)

Your smart contract will need to inherit from `DydxFlashloanBase` and have two functions:
1. An entrypoint function where __you__ call to initiate the flashloan (`initateFlashLoan` in the example below).
2. A callback function called `callFunction` that contains the action logic to perform once the loan is given to us.


```js
pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@studydefi/money-legos/dydx/contracts/DydxFlashloanBase.sol";
import "@studydefi/money-legos/dydx/contracts/ICallee.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract DydxFlashloaner is ICallee, DydxFlashloanBase {
    struct MyCustomData {
        address token;
        uint256 repayAmount;
    }

    // This is the function that will be called postLoan
    // i.e. Encode the logic to handle your flashloaned funds here
    function callFunction(
        address sender,
        Account.Info memory account,
        bytes memory data
    ) public {
        MyCustomData memory mcd = abi.decode(data, (MyCustomData));
        uint256 balOfLoanedToken = IERC20(mcd.token).balanceOf(address(this));

        // Note that you can ignore the line below
        // if your dydx account (this contract in this case)
        // has deposited at least ~2 Wei of assets into the account
        // to balance out the collaterization ratio
        require(
            balOfLoanedToken >= mcd.repayAmount,
            "Not enough funds to repay dydx loan!"
        );

        // TODO: Encode your logic here
        // E.g. arbitrage, liquidate accounts, etc
        revert("Hello, you haven't encoded your logic");
    }

    function initateFlashLoan(address _solo, address _token, uint256 _amount)
        external
    {
        ISoloMargin solo = ISoloMargin(_solo);

        // Get marketId from token address
        uint256 marketId = _getMarketIdFromTokenAddress(_solo, _token);

        // Calculate repay amount (_amount + (2 wei))
        // Approve transfer from
        uint256 repayAmount = _getRepaymentAmountInternal(_amount);
        IERC20(_token).approve(_solo, repayAmount);

        // 1. Withdraw $
        // 2. Call callFunction(...)
        // 3. Deposit back $
        Actions.ActionArgs[] memory operations = new Actions.ActionArgs[](3);

        operations[0] = _getWithdrawAction(marketId, _amount);
        operations[1] = _getCallAction(
            // Encode MyCustomData for callFunction
            abi.encode(MyCustomData({token: _token, repayAmount: repayAmount}))
        );
        operations[2] = _getDepositAction(marketId, repayAmount);

        Account.Info[] memory accountInfos = new Account.Info[](1);
        accountInfos[0] = _getAccountInfo();

        solo.operate(accountInfos, operations);
    }
}
```

### Flashloan Initiation (JavaScript)

Once you've deployed the contract, you can then call initiate the flashloan using the example below. Note that you can `MyCustomData` can be anything you desire, and if you would like to encode the data from the JS side, you can use `ethers.utils.defaultAbiCoder`.

```js
const dydxFlashloanerContract = new ethers.Contract(
  dydxFlashloanerAddress,
  def.abi,
  wallet
);

const main = async () => {
  const tx = await dydxFlashloanerContract.initateFlashLoan(
    legos.dydx.soloMargin.address,
    legos.erc20.weth.address, // Wanna take out a WETH loan
    ethers.utils.parseEther("10"),      // Wanna loan 10 WETH
    {
      gasLimit: 6000000,
    }
  );
  await tx.wait();
};
```