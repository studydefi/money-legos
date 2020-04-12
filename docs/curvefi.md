# CurveFi

[CurveFi](https://curve.finance) is an AMM optimized for stablecoins.


## Interface

```solidity
pragma solidity ^0.5.0;

contract ICurveFiSwap {
    function get_virtual_price() external returns (uint256 out);

    function add_liquidity(uint256[2] amounts, uint256 deadline) external;

    function get_dy(int128 i, int128 j, uint256 dx)
        external
        returns (uint256 out);

    function get_dy_underlying(int128 i, int128 j, uint256 dx)
        external
        returns (uint256 out);

    function exchange(
        int128 i,
        int128 j,
        uint256 dx,
        uint256 min_dy,
        uint256 deadline
    ) external;

    function exchange_underlying(
        int128 i,
        int128 j,
        uint256 dx,
        uint256 min_dy,
        uint256 deadline
    ) external;

    function remove_liquidity(
        uint256 _amount,
        uint256 deadline,
        uint256[2] calldata min_amounts
    ) external;

    function remove_liquidity_imbalance(uint256[2] calldata amounts, uint256 deadline)
        external;

    function commit_new_parameters(
        int128 amplification,
        int128 new_fee,
        int128 new_admin_fee
    ) external;

    function apply_new_parameters() external;

    function revert_new_parameters() external;

    function commit_transfer_ownership(address _owner) external;

    function apply_transfer_ownership() external;

    function revert_transfer_ownership() external;

    function withdraw_admin_fees() external;

    function coins(int128 arg0) external returns (address out);

    function underlying_coins(int128 arg0) external returns (address out);

    function balances(int128 arg0) external returns (uint256 out);

    function A() external returns (int128 out);

    function fee() external returns (int128 out);

    function admin_fee() external returns (int128 out);

    function owner() external returns (address out);

    function admin_actions_deadline() external returns (uint256 out);

    function transfer_ownership_deadline() external returns (uint256 out);

    function future_A() external returns (int128 out);

    function future_fee() external returns (int128 out);

    function future_admin_fee() external returns (int128 out);

    function future_owner() external returns (address out);
}
```

## Examples (JavaScript)

### Get Swap Return Amount

```javascript
// Quick reference
const curveFi = legos.curvefi.contracts;

// Curve finance cDai and cUSDC contract
const curveFicDU = new ethers.Contract(
  curveFi.cDai_cUsdc.curve.address,
  curveFi.curveAbi,
  wallet
);

const main = async () => {
  // Amount of DAI to Swap
  const daiAmount = 10;
  const daiAmountWei = ethers.utils.parseUnits(
    daiAmount.toString(),
    legos.erc20.contracts.dai.decimals
  );

  // How much USDC we'll get for cDAI we supplied
  const usdcRecvWei = await curveFicDU.get_dy_underlying(
    curveFi.cDai_cUsdc.indexes.dai,
    curveFi.cDai_cUsdc.indexes.usdc,
    daiAmountWei
  );
};
```

### Swap Stable Coins

```javascript
const curveFi = legos.curvefi.contracts;

// Curve finance cDai and cUSDC contract
const curveFicDU = new ethers.Contract(
  curveFi.cDai_cUsdc.curve.address,
  curveFi.curveAbi,
  wallet
);

const daiContract = new ethers.Contract(
  legos.erc20.contracts.dai.address,
  legos.erc20.contracts.abi,
  wallet
)

const main = async () => {
  // Need to approve transferFrom to curve contract
  await daiContract.approve(curveFi.cDai_cUsdc.curve.address, daiAmountWei);

  // Perform swap
  // Note that we have to manually specify this function as the newer
  // versions have an extra parameter: `deadline`
  // API is subject to change
  const tx = await curveFicDU['exchange_underlying(int128,int128,uint256,uint256)'](
    curveFi.cDai_cUsdc.indexes.dai,
    curveFi.cDai_cUsdc.indexes.usdc,
    daiAmountWei,
    1,
  );
  await tx.wait();
}
```