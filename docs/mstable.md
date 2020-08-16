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
// ../tests/mstable.test.ts#L60-L78

  test("Mint mUSD using DAI", async () => {
    // given
    const beforeWei = await mUSD.balanceOf(wallet.address);
    const before = parseFloat(fromWei(beforeWei));
    expect(before).toEqual(0);

    const usdcToDeposit = parseEther("100");

    await dai.approve(mUSD.address, usdcToDeposit);

    // when
    await mUSD.mint(dai.address, usdcToDeposit, { gasLimit: 700000 });

    // then
    const afterWei = await mUSD.balanceOf(wallet.address);
    const after = parseFloat(fromWei(afterWei));
    expect(after).toBe(parseFloat(fromWei(usdcToDeposit)));
  });
});
```
