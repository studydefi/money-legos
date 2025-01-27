// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;

interface IController {
    function withdraw(address, uint256) external;

    function withdrawAll(address) external;

    function strategies(address) external view returns (address);

    function approvedStrategies(address, address) external view returns (address);

    function balanceOf(address) external view returns (uint256);

    function earn(address, uint256) external;

    function approveStrategy(address, address) external;

    function setStrategy(address, address) external;

    function setVault(address, address) external;

    function want(address) external view returns (address);

    function rewards() external view returns (address);

    function vaults(address) external view returns (address);
}
