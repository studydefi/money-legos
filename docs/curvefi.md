# CurveFi

[CurveFi](https://curve.finance) is an AMM optimized for stablecoins. For more information about the interface, check out [the integration guide](https://github.com/curvefi/curve-contract/blob/master/integrations.md).


## Interface

### Curve
```solidity
contract ICurveFiCurve {
    function get_virtual_price() external returns (uint256 out);

    function add_liquidity(uint256[2] calldata amounts, uint256 deadline) external;

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
        uint256 min_dy
    ) external;

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
        uint256 min_dy
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

### Zap
```solidity
contract ICurveFiZap {
    function add_liquidity(
        uint256[2] calldata uamounts,
        uint256 min_mint_amount
    ) external;

    function remove_liquidity(uint256 _amount, uint256[2] calldata min_uamounts)
        external;

    function remove_liquidity_imbalance(
        uint256[2] calldata uamounts,
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

### Stable Coin Swapping

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

### Providing Liquidity

```javascript
const newTokenContract = (address) =>
  new ethers.Contract(address, legos.erc20.contracts.abi, wallet);

// ERC20 Contracts
const daiContract = newTokenContract(legos.erc20.contracts.dai.address);
const usdcContract = newTokenContract(legos.erc20.contracts.usdc.address);

// Quick reference
const curveFi = legos.curvefi.contracts;

// Curve finance cDai and cUSDC contract
const curveFicDU = new ethers.Contract(
  curveFi.cDai_cUsdc.curve.address,
  curveFi.curveAbi,
  wallet
);

const curveFicZap = new ethers.Contract(
  curveFi.cDai_cUsdc.zap.address,
  curveFi.curveAbi,
  wallet
)

const main = async () => {
  // Amount of DAI to provide
  const daiAmount = 100;
  const daiAmountWei = ethers.utils.parseUnits(
    daiAmount.toString(),
    legos.erc20.contracts.dai.decimals
  );

  // Amount of USDC to provide
  const usdcAmount = 100;
  const usdcAmountWei = ethers.utils.parseUnits(
    usdcAmount.toString(),
    legos.erc20.contracts.usdc.decimals
  )

  // Approve USDC Contract and USDC contract
  await daiContract.approve(
    curveFi.cDai_cUsdc.zap.address,
    daiAmountWei
  )
  await usdcContract.approve(
    curveFi.cDai_cUsdc.zap.address,
    usdcAmountWei
  )

  // Provide liquidity
  await curveFicZap.add_liquidity(
    [daiAmountWei, usdcAmountWei],
    1,
    {
      gasLimit: 1500000
    }
  )
};
```


## Examples (Solidity)

### Get Swap Return Amount

```solidity
pragma solidity ^0.5.0;

import "@studydefi/money-legos/src/curvefi/contracts/ICurveFiCurve.sol";

contract CurveFiManager {
    address constant curveFi_curve_cDai_cUsdc = 0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56;

    int128 constant daiIndex = 0;
    int128 constant usdcIndex = 1;

    function getSwapInfo(int128 from, int128 to, uint256 amount) external returns (uint) {
        ICurveFiCurve curve = ICurveFiCurve(curveFi_curve_cDai_cUsdc);
        curve.get_dy_underlying(from, to, amount);
    }
}
```

### Stable Coins Swapping

```solidity
pragma solidity ^0.5.0;

import "@studydefi/money-legos/src/curvefi/contracts/ICurveFiCurve.sol";

contract CurveFiManager {
    address constant curveFi_curve_cDai_cUsdc = 0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56;

    int128 constant daiIndex = 0;
    int128 constant usdcIndex = 1;

    function swap(int128 from, int128 to, uint256 amount) external {
        ICurveFiCurve curve = ICurveFiCurve(curveFi_curve_cDai_cUsdc);
        curve.exchange_underlying(from, to, amount, 1);
    }
}
```

### Providing Liquidity

```solidity
pragma solidity ^0.5.0;

import "@studydefi/money-legos/src/curvefi/contracts/ICurveFiZap.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CurveFiManager {
    address constant curveFi_zap_cDai_cUsdc = 0xeB21209ae4C2c9FF2a86ACA31E123764A3B6Bc06;

    int128 constant daiIndex = 0;
    int128 constant usdcIndex = 1;

    function _addDaiUsdcLiquidity(uint256 daiAmount, uint256 usdcAmount) internal {
        // Initialize our curve
        ICurveFiZap zap = ICurveFiZap(curveFi_zap_cDai_cUsdc);

        // Remember to allow "transferFrom"
        zap.add_liquidity([daiAmount, usdcAmount], 1);
    }
}
```