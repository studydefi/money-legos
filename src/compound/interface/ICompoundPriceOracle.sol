pragma solidity ^0.5.0;

contract ICompoundPriceOracle {
    function getUnderlyingPrice(address cToken) external view returns (uint256);
}