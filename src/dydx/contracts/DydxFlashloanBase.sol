pragma solidity ^0.5.7;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./ISoloMargin.sol";


contract DydxFlashloanBase {
    using SafeMath for uint256;

    mapping(address => uint256) public tokenAddressToMarketId;

    ISoloMargin solo = ISoloMargin(0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e);

    function() external payable {}

    constructor() public {
        updateMarketToTokenAddresses();
    }

    // Updates mapping from token address => market id
    function updateMarketToTokenAddresses() public {
        uint256 numMarkets = solo.getNumMarkets();

        address curTokenAddress;
        for (uint256 i = 0; i < numMarkets; i++) {
            curTokenAddress = solo.getMarketTokenAddress(i);
            tokenAddressToMarketId[curTokenAddress] = i;
        }
    }

    function callFunction(
        address sender,
        Account.Info memory account,
        bytes memory data
    ) public {
        // TODO: Encode your logic here
        return;
    }

    function flashloan(address token, uint256 amount) external {
        uint256 repayAmount = _getRepaymentAmountInternal(token, amount);
        IERC20(token).approve(address(solo), repayAmount);

        // 1. Withdraw $
        // 2. Call <function> with withdrawn $
        // 3. Return $
        Actions.ActionArgs[] memory operations = new Actions.ActionArgs[](3);

        operations[0] = _getWithdrawAction(token, amount);
        operations[1] = _getCallAction();
        operations[2] = _getDepositAction(token, repayAmount);

        Account.Info[] memory accountInfos = new Account.Info[](1);
        accountInfos[0] = _getAccountInfo();

        solo.operate(accountInfos, operations);
    }

    function _getRepaymentAmountInternal(address token, uint256 amount)
        internal
        view
        returns (uint256)
    {
        // Add 1 wei for markets 0-1 and 2 wei for markets 2-3
        return amount.add(tokenAddressToMarketId[token] < 2 ? 1 : 2);
    }

    function _getAccountInfo() internal view returns (Account.Info memory) {
        return Account.Info({owner: address(this), number: 1});
    }

    function _getWithdrawAction(address token, uint256 amount)
        internal
        view
        returns (Actions.ActionArgs memory)
    {
        return
            Actions.ActionArgs({
                actionType: Actions.ActionType.Withdraw,
                accountId: 0,
                amount: Types.AssetAmount({
                    sign: false,
                    denomination: Types.AssetDenomination.Wei,
                    ref: Types.AssetReference.Delta,
                    value: amount
                }),
                primaryMarketId: tokenAddressToMarketId[token],
                secondaryMarketId: 0,
                otherAddress: address(this),
                otherAccountId: 0,
                data: ""
            });
    }

    function _getCallAction()
        internal
        view
        returns (Actions.ActionArgs memory)
    {
        return
            Actions.ActionArgs({
                actionType: Actions.ActionType.Call,
                accountId: 0,
                amount: Types.AssetAmount({
                    sign: false,
                    denomination: Types.AssetDenomination.Wei,
                    ref: Types.AssetReference.Delta,
                    value: 0
                }),
                primaryMarketId: 0,
                secondaryMarketId: 0,
                otherAddress: address(this),
                otherAccountId: 0,
                data: ""
            });
    }

    function _getDepositAction(address token, uint256 amount)
        internal
        view
        returns (Actions.ActionArgs memory)
    {
        return
            Actions.ActionArgs({
                actionType: Actions.ActionType.Deposit,
                accountId: 0,
                amount: Types.AssetAmount({
                    sign: true,
                    denomination: Types.AssetDenomination.Wei,
                    ref: Types.AssetReference.Delta,
                    value: amount
                }),
                primaryMarketId: tokenAddressToMarketId[token],
                secondaryMarketId: 0,
                otherAddress: address(this),
                otherAccountId: 0,
                data: ""
            });
    }
}
