pragma solidity ^0.5.0;

import "@studydefi/money-legos/compound/contracts/IComptroller.sol";
import "@studydefi/money-legos/compound/contracts/ICEther.sol";
import "@studydefi/money-legos/compound/contracts/ICToken.sol";

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