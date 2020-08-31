# mStable

mStable is a protocol that unites stablecoins, lending and swapping into one robust and easy to use standard.

## Interface

### Masset

```js
// ../src/mstable/contracts/Masset.sol

pragma solidity ^0.5.0;

interface Masset {

    /**
     * @dev Mint a single bAsset, at a 1:1 ratio with the bAsset. This contract
     *      must have approval to spend the senders bAsset
     * @param _bAsset         Address of the bAsset to mint
     * @param _bAssetQuantity Quantity in bAsset units
     * @return massetMinted   Number of newly minted mAssets
     */
    function mint(address _bAsset, uint256 _bAssetQuantity) external returns (uint256 massetMinted);


    /**
     * @dev Mint a single bAsset, at a 1:1 ratio with the bAsset. This contract
     *      must have approval to spend the senders bAsset
     * @param _bAsset         Address of the bAsset to mint
     * @param _bAssetQuantity Quantity in bAsset units
     * @param _recipient receipient of the newly minted mAsset tokens
     * @return massetMinted   Number of newly minted mAssets
     */
    function mintTo(address _bAsset, uint256 _bAssetQuantity, address _recipient) external returns (uint256 massetMinted);


    /**
     * @dev Mint with multiple bAssets, at a 1:1 ratio to mAsset. This contract
     *      must have approval to spend the senders bAssets
     * @param _bAssets          Non-duplicate address array of bAssets with which to mint
     * @param _bAssetQuantity   Quantity of each bAsset to mint. Order of array
     *                          should mirror the above
     * @param _recipient        Address to receive the newly minted mAsset tokens
     * @return massetMinted     Number of newly minted mAssets
     */
    function mintMulti(address[] calldata _bAssets, uint256[] calldata _bAssetQuantity, address _recipient) external returns(uint256 massetMinted);


    /**
     * @dev Simply swaps one bAsset for another bAsset or this mAsset at a 1:1 ratio.
     * bAsset <> bAsset swaps will incur a small fee (swapFee()). Swap
     * is valid if it does not result in the input asset exceeding its maximum weight.
     * @param _input        bAsset to deposit
     * @param _output       Asset to receive - either a bAsset or mAsset(this)
     * @param _quantity     Units of input bAsset to swap
     * @param _recipient    Address to credit output asset
     * @return output       Units of output asset returned
     */
    function swap(address _input, address _output, uint256 _quantity, address _recipient) external returns (uint256 output);

    

    /**
     * @dev Determines both if a trade is valid, and the expected fee or output.
     * Swap is valid if it does not result in the input asset exceeding its maximum weight.
     * @param _input        bAsset to deposit
     * @param _output       Asset to receive - bAsset or mAsset(this)
     * @param _quantity     Units of input bAsset to swap
     * @return valid        Bool to signify that swap is current valid
     * @return reason       If swap is invalid, this is the reason
     * @return output       Units of _output asset the trade would return
     */
    function getSwapOutput(address _input, address _output, uint256 _quantity) external view returns (bool, string memory, uint256 output);


    /**
     * @dev Credits the sender with a certain quantity of selected bAsset, in exchange for burning the
     *      relative mAsset quantity from the sender. Sender also incurs a small mAsset fee, if any.
     * @param _bAsset           Address of the bAsset to redeem
     * @param _bAssetQuantity   Units of the bAsset to redeem
     * @return massetMinted     Relative number of mAsset units burned to pay for the bAssets
     */
    function redeem(address _bAsset, uint256 _bAssetQuantity) external returns (uint256 massetRedeemed);


    /**
     * @dev Credits a recipient with a certain quantity of selected bAsset, in exchange for burning the
     *      relative Masset quantity from the sender. Sender also incurs a small fee, if any.
     * @param _bAsset           Address of the bAsset to redeem
     * @param _bAssetQuantity   Units of the bAsset to redeem
     * @param _recipient        Address to credit with withdrawn bAssets
     * @return massetMinted     Relative number of mAsset units burned to pay for the bAssets
     */
    function redeemTo(address _bAsset, uint256 _bAssetQuantity, address _recipient) external returns (uint256 massetRedeemed);



    /**
    * @dev Credits a recipient with a proportionate amount of bAssets, relative to current vault
    * balance levels and desired mAsset quantity. Burns the mAsset as payment.
    * @param _mAssetQuantity   Quantity of mAsset to redeem
    * @param _recipient        Address to credit the withdrawn bAssets
    */
    function redeemMasset(uint256 _mAssetQuantity, address _recipient) external nonReentrant;
}
```

## Examples (JavaScript)

### Mint mUSD using DAI

```js
// ../tests/mstable.test.ts#L89-L106

test("Mint mUSD using DAI", async () => {
  // given
  const beforeWei = await mUSD.balanceOf(wallet.address);
  const before = parseFloat(fromWei(beforeWei));
  expect(before).toEqual(0);

  const daiToDeposit = parseEther("5000");

  await dai.approve(mUSD.address, daiToDeposit);

  // when
  await mUSD.mint(dai.address, daiToDeposit, { gasLimit: 700000 });

  // then
  const afterWei = await mUSD.balanceOf(wallet.address);
  const after = parseFloat(fromWei(afterWei));
  expect(after).toBe(parseFloat(fromWei(daiToDeposit)));
});
```

### Redeem USDC using mUSD

```js
// ../tests/mstable.test.ts#L108-L127

test("Redeem USDC using mUSD", async () => {
  // given
  const beforeWei = await usdc.balanceOf(wallet.address);
  const before = parseFloat(fromWei(beforeWei));
  expect(before).toEqual(0);

  const toRedeemWei = parseUnits("1000", erc20.usdc.decimals);
  const swapFee = await mUSD.swapFee();
  const feeToPay = toRedeemWei.mul(swapFee).div(parseEther("1"));

  // when
  await mUSD.redeem(usdc.address, toRedeemWei, {
    gasLimit: 700000,
  });

  // then
  const afterWei = await usdc.balanceOf(wallet.address);
  const after = parseFloat(fromWei(afterWei));
  expect(after).toBe(parseFloat(fromWei(toRedeemWei.sub(feeToPay))));
});
```

### Earn MTA

```js
// ../tests/mstable.test.ts#L129-L173

describe("Earn MTA", () => {
  test("Add liqudity to mUSD/USDC Balancer Pool", async () => {
    // given
    const bptBeforeWei = await pool.balanceOf(wallet.address);
    const bptBefore = parseFloat(fromWei(bptBeforeWei));
    expect(bptBefore).toEqual(0);

    await mUSD.approve(pool.address, MAX_UINT256);
    await usdc.approve(pool.address, MAX_UINT256);

    // when
    const poolAmountOut = parseEther("2.5");
    const maxAmountsIn = [
      parseUnits("500", mstable.mUSD.decimals),
      parseUnits("500", erc20.usdc.decimals),
    ];
    await pool.joinPool(poolAmountOut, maxAmountsIn, { gasLimit: 500000 });

    // then
    const bptAfterWei = await pool.balanceOf(wallet.address);
    const bptAfter = parseFloat(fromWei(bptAfterWei));
    expect(bptAfter).toEqual(parseFloat(fromWei(poolAmountOut)));
  });

  test("Stake BPT to earn MTA", async () => {
    // given
    const mtaBeforeWei = await mta.balanceOf(wallet.address);
    const mtaBefore = parseFloat(fromWei(mtaBeforeWei));
    expect(mtaBefore).toEqual(0);

    const bptBalance = await pool.balanceOf(wallet.address);

    await pool.approve(earn.address, MAX_UINT256);

    // when
    await earn.stake(wallet.address, bptBalance);
    await increaseTime(provider, 60 * 60 * 24);
    await earn.claimReward();

    // then
    const mtaAfterWei = await mta.balanceOf(wallet.address);
    const mtaAfter = parseFloat(fromWei(mtaAfterWei));
    expect(mtaAfter).toBeGreaterThan(0);
  });
});
```
