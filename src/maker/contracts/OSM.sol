pragma solidity ^0.5.0;


interface OSM {
    function bud(address) external view returns (uint256);

    function change(address src_) external;

    function deny(address usr) external;

    function diss(address[] memory a) external;

    function diss(address a) external;

    function hop() external view returns (uint16);

    function kiss(address[] memory a) external;

    function kiss(address a) external;

    function pass() external view returns (bool ok);

    function peek() external view returns (bytes32, bool);

    function peep() external view returns (bytes32, bool);

    function poke() external;

    function read() external view returns (bytes32);

    function rely(address usr) external;

    function src() external view returns (address);

    function start() external;

    function step(uint16 ts) external;

    function stop() external;

    function stopped() external view returns (uint256);

    function void() external;

    function wards(address) external view returns (uint256);

    function zzz() external view returns (uint64);
}
