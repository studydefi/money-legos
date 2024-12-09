pragma solidity ^0.8.0;

import "./BPool.sol";

interface BFactory {

    function isBPool(address b) external view returns (bool);
    function newBPool() external returns (BPool);
    
}