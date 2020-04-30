interface IMedianizer {
    function setOwner(address owner_) external;

    function poke(bytes32) external;

    function poke() external;

    function compute() external returns (bytes32, bool);

    function set(address wat) external;

    function unset(address wat) external;

    function indexes(address) external returns (bytes12);

    function next() external returns (bytes12);

    function read() external returns (bytes32);

    function peek() external returns (bytes32, bool);

    function values(bytes12) external returns (address);

    function setMin(uint96 min_) external;

    function setAuthority(address authority_) external;

    function owner() external returns (address);

    function void() external;

    function set(bytes12 pos, address wat) external;

    function authority() external returns (address);

    function unset(bytes12 pos) external;

    function setNext(bytes12 next_) external;

    function min() external returns (uint96);
}
