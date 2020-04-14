# Compound

## Interface

### ICEther

```javascript
pragma solidity ^0.5.0;

contract ICEther {
    function mint() external payable;
    function borrow(uint borrowAmount) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function redeemUnderlying(uint redeemAmount) external returns (uint);
    function repayBorrow() external payable;
    function repayBorrowBehalf(address borrower) external payable;
    function borrowBalanceCurrent(address account) external returns (uint);
    function borrowBalanceStored(address account) external view returns (uint256);
    function balanceOfUnderlying(address account) external returns (uint);
    function balanceOf(address owner) external view returns (uint256);
    function getAccountSnapshot(address account) external view returns (uint, uint, uint, uint);
}
```

### ICompoundPriceOracle

```javascript
pragma solidity ^0.5.0;

contract ICompoundPriceOracle {
    function getUnderlyingPrice(address cToken) external view returns (uint256);
}
```

### IComptroller

```javascript
pragma solidity ^0.5.0;

interface IComptroller {
    /**
     * @notice Marker function used for light validation when updating the comptroller of a market
     * @dev Implementations should simply return true.
     * @return true
     */
    function isComptroller() external view returns (bool);

    /*** Assets You Are In ***/

    function enterMarkets(address[] calldata cTokens) external returns (uint[] memory);
    function exitMarket(address cToken) external returns (uint);

    /*** Policy Hooks ***/

    function getAccountLiquidity(address account) external view returns (uint, uint, uint);
    function getAssetsIn(address account) external view returns (address[] memory);

    function mintAllowed(address cToken, address minter, uint mintAmount) external returns (uint);
    function mintVerify(address cToken, address minter, uint mintAmount, uint mintTokens) external;

    function redeemAllowed(address cToken, address redeemer, uint redeemTokens) external returns (uint);
    function redeemVerify(address cToken, address redeemer, uint redeemAmount, uint redeemTokens) external;

    function borrowAllowed(address cToken, address borrower, uint borrowAmount) external returns (uint);
    function borrowVerify(address cToken, address borrower, uint borrowAmount) external;

    function repayBorrowAllowed(
        address cToken,
        address payer,
        address borrower,
        uint repayAmount) external returns (uint);
    function repayBorrowVerify(
        address cToken,
        address payer,
        address borrower,
        uint repayAmount,
        uint borrowerIndex) external;

    function liquidateBorrowAllowed(
        address cTokenBorrowed,
        address cTokenCollateral,
        address liquidator,
        address borrower,
        uint repayAmount) external returns (uint);
    function liquidateBorrowVerify(
        address cTokenBorrowed,
        address cTokenCollateral,
        address liquidator,
        address borrower,
        uint repayAmount,
        uint seizeTokens) external;

    function seizeAllowed(
        address cTokenCollateral,
        address cTokenBorrowed,
        address liquidator,
        address borrower,
        uint seizeTokens) external returns (uint);
    function seizeVerify(
        address cTokenCollateral,
        address cTokenBorrowed,
        address liquidator,
        address borrower,
        uint seizeTokens) external;

    function transferAllowed(address cToken, address src, address dst, uint transferTokens) external returns (uint);
    function transferVerify(address cToken, address src, address dst, uint transferTokens) external;

    /*** Liquidity/Liquidation Calculations ***/

    function liquidateCalculateSeizeTokens(
        address cTokenBorrowed,
        address cTokenCollateral,
        uint repayAmount) external view returns (uint, uint);
}
```

### ICToken

```javascript
pragma solidity 0.5.16;

interface ICToken {
    function mint(uint mintAmount) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function redeemUnderlying(uint redeemAmount) external returns (uint);
    function borrow(uint borrowAmount) external returns (uint);
    function repayBorrow(uint repayAmount) external returns (uint);
    function repayBorrowBehalf(address borrower, uint repayAmount) external returns (uint);
    function exchangeRateCurrent() external returns (uint);
    function borrowBalanceCurrent(address account) external returns (uint);
    function borrowBalanceStored(address account) external view returns (uint256);
    function balanceOfUnderlying(address account) external returns (uint);
    function getAccountSnapshot(address account) external view returns (uint, uint, uint, uint);

    function underlying() external view returns (address);
    function totalSupply() external view returns (uint256);
    function balanceOf(address owner) external view returns (uint256 balance);
    function allowance(address, address) external view returns (uint);
    function approve(address, uint) external;
    function transfer(address, uint) external returns (bool);
    function transferFrom(address, address, uint) external returns (bool);
}
```

## Examples (JavaScript)

### Entering Markets

```javascript
const main = async () => {
  const comptrollerContract = new ethers.Contract(
    legos.compound.contracts.comptroller.address,
    legos.compound.contracts.comptroller.abi,
    wallet,
  );

  await comptrollerContract.enterMarkets([
    legos.compound.contracts.cEther.address,
    legos.compound.contracts.cDAI.address,
  ]);
};

main();
```

### Supplying/Borrowing Tokens

Note that you'll need to call `enterMarkets` with a cToken before you're able to `mint` or `borrow` from that particular cToken.

```javascript
const newCTokenContract = (address) =>
  new ethers.Contract(address, legos.compound.contracts.cTokenAbi, wallet);

const newTokenContract = (address) =>
  new ethers.Contract(address, legos.erc20.contracts.abi, wallet);

const main = async () => {
  // Supply 1 ETH
  const cEtherContract = new ethers.Contract(
    legos.compound.contracts.cEther.address,
    legos.compound.contracts.cEther.abi,
    wallet
  );
  await cEtherContract.mint({
    gasLimit: 1500000,
    value: ethers.utils.parseEther("1"),
  });

  // Borrow 20 DAI
  const cDaiContract = newCTokenContract(legos.compound.contracts.cDAI.address);
  await cDaiContract.borrow(
    ethers.utils.parseUnits("20", legos.erc20.contracts.dai.decimals),
    { gasLimit: 1500000 }
  );

  // Supply 5 DAI (need to approve transferFrom first to cDAI)
  const daiToSupply = ethers.utils.parseUnits(
    "1",
    legos.erc20.contracts.dai.decimals
  );
  await newTokenContract(legos.erc20.contracts.dai.address).approve(
    legos.compound.contracts.cDAI.address,
    daiToSupply
  );
  await cDaiContract.mint(daiToSupply, { gasLimit: 1500000 });
};

main();
```

### Retrieve Supply/Borrow Balance
Unfortunately this feature isn't documented nicely in [Compound's docs](https://compound.finance/developers). The best way quickly retrieve a supply/borrow balance for a particular cToken is through the `getAccountSnapshot` function (as it is a `view` function and doesn't modify state).

```javascript
const newCTokenContract = (address) =>
  new ethers.Contract(address, legos.compound.contracts.cTokenAbi, wallet);

const main = async () => {
  const cDaiContract = newCTokenContract(legos.compound.contracts.cDAI.address);
  const daiDecimals = legos.erc20.contracts.dai.decimals;

  const [
    err,
    cTokenBalance,
    borrowBalance,
    exchangeRateMantissa,
  ] = await cDaiContract.getAccountSnapshot(wallet.address);

  const expScale = new BigNumber(10).pow(18);
  const supplied = cTokenBalance.mul(exchangeRateMantissa).div(expScale);

  console.log(`DAI Supply: ${ethers.utils.formatUnits(supplied, daiDecimals)}`);
  console.log(
    `DAI Borrowed: ${ethers.utils.formatUnits(borrowBalance, daiDecimals)}`
  );
};

main();
```

### Withdraw Supply
```javascript
const main = async () => {
  const cEtherContract = new ethers.Contract(
    legos.compound.contracts.cEther.address,
    legos.compound.contracts.cEther.abi,
    wallet
  );

  // Withdraws 1 Ether
  await cEtherContract.redeemUnderlying(ethers.utils.parseEther("1"), {
    gasLimit: 1500000,
  });
};

main();
```

### Repay Debt
```javascript
const newCTokenContract = (address) =>
  new ethers.Contract(address, legos.compound.contracts.cTokenAbi, wallet);

const newTokenContract = (address) =>
  new ethers.Contract(address, legos.erc20.contracts.abi, wallet);

const main = async () => {
  const amountToRepay = ethers.utils.parseUnits(
    "1",
    legos.erc20.contracts.dai.decimals
  );

  const daiContract = newTokenContract(legos.erc20.contracts.dai.address);
  const cDaiContract = newCTokenContract(legos.compound.contracts.cDAI.address);

  // Approves transferFrom
  await daiContract.approve(
    legos.compound.contracts.cDAI.address,
    amountToRepay
  );

  // Repays 1 DAI
  await cDaiContract.repayBorrow(amountToRepay, {
    gasLimit: 1500000,
  });
};

main();
```


## Examples (Solidity)

The source code below comes from [Dedge's Compound Manager](https://github.com/studydefi/dedge/blob/master/packages/smart-contracts/src/managers/DedgeCompoundManager.sol). Be aware that as the smart contract is interacting with the Compound protocol directly, it is responsible for paying off its debts.

As of April 2020, there is no way to transfer collateral/debt between accounts. As such, the recommended way to interact with the `CompoundManager` code is through a [proxy with delegatecall support](https://eips.ethereum.org/EIPS/eip-1822).

```solidity
pragma solidity ^0.5.0;

import "@studydefi/money-legos/src/compound/contracts/IComptroller.sol";
import "@studydefi/money-legos/src/compound/contracts/ICEther.sol";
import "@studydefi/money-legos/src/compound/contracts/ICToken.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract CompoundManager {
    using SafeMath for uint256;

    address constant CompoundComptrollerAddress = 0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B;
    address constant CEtherAddress = 0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5;

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "safe-math-sub-failed");
        uint256 c = a - b;

        return c;
    }

    function _transferFromUnderlying(
        address sender,
        address recipient,
        address cToken,
        uint256 amount
    ) internal {
        address underlying = ICToken(cToken).underlying();
        require(
            IERC20(underlying).transferFrom(sender, recipient, amount),
            "cmpnd-mgr-transferFrom-underlying-failed"
        );
    }

    function _transferUnderlying(
        address cToken,
        address recipient,
        uint256 amount
    ) internal {
        if (cToken == CEtherAddress) {
            recipient.call.value(amount)("");
        } else {
            require(
                IERC20(ICToken(cToken).underlying()).transfer(
                    recipient,
                    amount
                ),
                "cmpnd-mgr-transfer-underlying-failed"
            );
        }
    }

    function _transfer(address token, address recipient, uint256 amount)
        internal
    {
        require(
            IERC20(token).transfer(recipient, amount),
            "cmpnd-mgr-transfer-failed"
        );
    }

    function getBorrowBalanceUnderlying(
        address cToken,
        address owner
    )
        public
        view
        returns (uint256)
    {
        (
            uint256 err,
            uint256 cTokenBalance,
            uint256 borrowBalance,
            uint256 exchangeRateMantissa
        ) = ICToken(cToken).getAccountSnapshot(owner);

        // Source: balanceOfUnderlying from any ctoken
        return cTokenBalance.mul(exchangeRateMantissa).div(1e18);
    }

    function enterMarkets(
        address[] memory cTokens // Address of the Compound derivation token (e.g. cDAI)
    ) public {
        // Enter the compound markets for all the specified tokens
        uint256[] memory errors = IComptroller(CompoundComptrollerAddress)
            .enterMarkets(cTokens);

        for (uint256 i = 0; i < errors.length; i++) {
            require(errors[i] == 0, "cmpnd-mgr-enter-markets-failed");
        }
    }

    function approveCToken(address cToken, uint256 amount) public {
        // Approves CToken contract to call `transferFrom`
        address underlying = ICToken(cToken).underlying();
        require(
            IERC20(underlying).approve(cToken, amount) == true,
            "cmpnd-mgr-ctoken-approved-failed"
        );
    }

    function approveCTokens(
        address[] memory cTokens // Tokens to approve
    ) public {
        for (uint256 i = 0; i < cTokens.length; i++) {
            // Don't need to approve ICEther
            if (cTokens[i] != CEtherAddress) {
                approveCToken(cTokens[i], uint256(-1));
            }
        }
    }

    function enterMarketsAndApproveCTokens(address[] memory cTokens) public {
        enterMarkets(cTokens);
        approveCTokens(cTokens);
    }

    function supply(address cToken, uint256 amount) public payable {
        if (cToken == CEtherAddress) {
            ICEther(CEtherAddress).mint.value(amount)();
        } else {
            // Approves CToken contract to call `transferFrom`
            approveCToken(cToken, amount);

            require(
                ICToken(cToken).mint(amount) == 0,
                "cmpnd-mgr-ctoken-supply-failed"
            );
        }
    }

    function borrow(address cToken, uint256 borrowAmount) public {
        require(
            ICToken(cToken).borrow(borrowAmount) == 0,
            "cmpnd-mgr-ctoken-borrow-failed"
        );
    }

    function supplyAndBorrow(
        address supplyCToken,
        uint256 supplyAmount,
        address borrowCToken,
        uint256 borrowAmount
    ) public payable {
        supply(supplyCToken, supplyAmount);
        borrow(borrowCToken, borrowAmount);
    }

    function repayBorrow(address cToken, uint256 amount) public payable {
        if (cToken == CEtherAddress) {
            ICEther(cToken).repayBorrow.value(amount)();
        } else {
            approveCToken(cToken, amount);
            require(
                ICToken(cToken).repayBorrow(amount) == 0,
                "cmpnd-mgr-ctoken-repay-failed"
            );
        }
    }

    function repayBorrowBehalf(
        address recipient,
        address cToken,
        uint256 amount
    ) public payable {
        if (cToken == CEtherAddress) {
            ICEther(cToken).repayBorrowBehalf.value(amount)(recipient);
        } else {
            approveCToken(cToken, amount);
            require(
                ICToken(cToken).repayBorrowBehalf(recipient, amount) == 0,
                "cmpnd-mgr-ctoken-repaybehalf-failed"
            );
        }
    }

    function redeem(address cToken, uint256 redeemTokens) public payable {
        require(
            ICToken(cToken).redeem(redeemTokens) == 0,
            "cmpnd-mgr-ctoken-redeem-failed"
        );
    }

    function redeemUnderlying(address cToken, uint256 redeemTokens)
        public
        payable
    {
        require(
            ICToken(cToken).redeemUnderlying(redeemTokens) == 0,
            "cmpnd-mgr-ctoken-redeem-underlying-failed"
        );
    }
}
```