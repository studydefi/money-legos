pragma solidity ^0.5.0;


interface IMedianizer {
    function setOwner(address owner_) external;

    function poke(bytes32) external;

    function poke() external;

    function compute() external view returns (bytes32, bool);

    function set(address wat) external;

    function unset(address wat) external;

    function indexes(address) external view returns (bytes12);

    function next() external view returns (bytes12);

    function read() external view returns (bytes32);

    function peek() external view returns (bytes32, bool);

    function values(bytes12) external view returns (address);

    function setMin(uint96 min_) external;

    function setAuthority(address authority_) external;

    function owner() external view returns (address);

    function void() external;

    function set(bytes12 pos, address wat) external;

    function authority() external view returns (address);

    function unset(bytes12 pos) external;

    function setNext(bytes12 next_) external;

    function min() external view returns (uint96);
}
