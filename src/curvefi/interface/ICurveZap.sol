pragma solidity ^0.5.0;

contract ICurveFiZap {
    function add_liquidity(uint256[2] memory uamounts, uint256 min_mint_amount)
        external;

    function remove_liquidity(uint256 _amount, uint256[2] memory min_uamounts)
        external;

    function remove_liquidity_imbalance(
        uint256[2] uamounts,
        uint256 max_burn_amount
    ) external;

    function calc_withdraw_one_coin(uint256 _token_amount, int128 i)
        external
        returns (uint256);

    function remove_liquidity_one_coin(
        uint256 _token_amount,
        int128 i,
        uint256 min_uamount
    ) external;

    function remove_liquidity_one_coin(
        uint256 _token_amount,
        int128 i,
        uint256 min_uamount,
        bool donate_dust
    ) external;

    function withdraw_donated_dust() external;

    function coins(int128 arg0) external returns (address);

    function underlying_coins(int128 arg0) external returns (address);

    function curve() external returns (address);

    function token() external returns (address);
}
