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