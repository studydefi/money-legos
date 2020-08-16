# Synthetix

Synthetix is a decentralized platform on Ethereum for the creation of Synths: on-chain synthetic assets that track the value of real-world assets.

## Interface

### IDepot

```js
// ../src/synthetix/contracts/IDepot.sol

pragma solidity >=0.4.24;


interface IDepot {
    // Views
    function fundsWallet() external view returns (address payable);

    function maxEthPurchase() external view returns (uint);

    function minimumDepositAmount() external view returns (uint);

    function synthsReceivedForEther(uint amount) external view returns (uint);

    function totalSellableDeposits() external view returns (uint);

    // Mutative functions
    function depositSynths(uint amount) external;

    function exchangeEtherForSynths() external payable returns (uint);

    function exchangeEtherForSynthsAtRate(uint guaranteedRate) external payable returns (uint);

    function withdrawMyDepositedSynths() external;

    // Note: On mainnet no SNX has been deposited. The following functions are kept alive for testnet SNX faucets.
    function exchangeEtherForSNX() external payable returns (uint);

    function exchangeEtherForSNXAtRate(uint guaranteedRate, uint guaranteedSynthetixRate) external payable returns (uint);

    function exchangeSynthsForSNX(uint synthAmount) external returns (uint);

    function exchangeSynthsForSNXAtRate(uint synthAmount, uint guaranteedRate) external returns (uint);
}
```

### ISynth

```js
// ../src/synthetix/contracts/ISynth.sol

pragma solidity >=0.4.24;


interface ISynth {
    // Views
    function currencyKey() external view returns (bytes32);

    function transferableSynths(address account) external view returns (uint);

    // Mutative functions
    function transferAndSettle(address to, uint value) external returns (bool);

    function transferFromAndSettle(
        address from,
        address to,
        uint value
    ) external returns (bool);

    // Restricted: used internally to Synthetix
    function burn(address account, uint amount) external;

    function issue(address account, uint amount) external;
}
```

### ISynthetix

```js
// ../src/synthetix/contracts/ISynthetix.sol

pragma solidity >=0.4.24;

import "./ISynth.sol";


interface ISynthetix {
    // Views
    function availableCurrencyKeys() external view returns (bytes32[] memory);

    function availableSynthCount() external view returns (uint);

    function collateral(address account) external view returns (uint);

    function collateralisationRatio(address issuer) external view returns (uint);

    function debtBalanceOf(address issuer, bytes32 currencyKey) external view returns (uint);

    function debtBalanceOfAndTotalDebt(address issuer, bytes32 currencyKey)
        external
        view
        returns (uint debtBalance, uint totalSystemValue);

    function isWaitingPeriod(bytes32 currencyKey) external view returns (bool);

    function maxIssuableSynths(address issuer) external view returns (uint maxIssuable);

    function remainingIssuableSynths(address issuer)
        external
        view
        returns (
            uint maxIssuable,
            uint alreadyIssued,
            uint totalSystemDebt
        );

    function synths(bytes32 currencyKey) external view returns (ISynth);

    function synthsByAddress(address synthAddress) external view returns (bytes32);

    function totalIssuedSynths(bytes32 currencyKey) external view returns (uint);

    function totalIssuedSynthsExcludeEtherCollateral(bytes32 currencyKey) external view returns (uint);

    function transferableSynthetix(address account) external view returns (uint);

    // Mutative Functions
    function burnSynths(uint amount) external;

    function burnSynthsOnBehalf(address burnForAddress, uint amount) external;

    function burnSynthsToTarget() external;

    function burnSynthsToTargetOnBehalf(address burnForAddress) external;

    function exchange(
        bytes32 sourceCurrencyKey,
        uint sourceAmount,
        bytes32 destinationCurrencyKey
    ) external returns (uint amountReceived);

    function exchangeOnBehalf(
        address exchangeForAddress,
        bytes32 sourceCurrencyKey,
        uint sourceAmount,
        bytes32 destinationCurrencyKey
    ) external returns (uint amountReceived);

    function issueMaxSynths() external;

    function issueMaxSynthsOnBehalf(address issueForAddress) external;

    function issueSynths(uint amount) external;

    function issueSynthsOnBehalf(address issueForAddress, uint amount) external;

    function mint() external returns (bool);

    function settle(bytes32 currencyKey)
        external
        returns (
            uint reclaimed,
            uint refunded,
            uint numEntries
        );

    function liquidateDelinquentAccount(address account, uint susdAmount) external returns (bool);
}
```

## Examples (JavaScript)

### Get some SNX from Uniswap

```js
// ../tests/synthetix.test.ts#L93-L116

test("get some SNX from Uniswap", async () => {
  // given
  const snxBefore = await snxContract.balanceOf(wallet.address);
  expect(fromWei(snxBefore)).toBe("0.0");

  const ethToSell = 5;
  const ethToSellInWei = parseEther(ethToSell.toString());

  const expectedSnx = await snxExchangeContract.getEthToTokenInputPrice(
    ethToSellInWei,
  );

  // when
  const min = 1;
  const deadline = 2525644800;
  await snxExchangeContract.ethToTokenSwapInput(min, deadline, {
    gasLimit: 4000000,
    value: ethToSellInWei,
  });

  // then
  const snxAfter = await snxContract.balanceOf(wallet.address);
  expect(fromWei(snxAfter)).toBe(fromWei(expectedSnx));
});
```

### Issue 100 sUSD tokens

```js
// ../tests/synthetix.test.ts#L118-L146

test("issue 100 sUSD tokens", async () => {
  // given
  const sUSDBefore = await sUSDContract.balanceOf(wallet.address);
  expect(fromWei(sUSDBefore)).toBe("0.0");

  const sUSDToMint = 100;
  const sUSDToMintInWei = parseEther(sUSDToMint.toString());

  const {
    maxIssuable,
    alreadyIssued: alreadyIssuedBefore,
  } = await synthetixContract.remainingIssuableSynths(wallet.address);
  expect(alreadyIssuedBefore.toString()).toBe("0");
  expect(parseFloat(fromWei(maxIssuable))).toBeGreaterThanOrEqual(sUSDToMint);

  // when
  await synthetixContract.issueSynths(sUSDToMintInWei, {
    gasLimit: 4000000,
  });

  const {
    alreadyIssued: alreadyIssuedAfter,
  } = await synthetixContract.remainingIssuableSynths(wallet.address);
  expect(alreadyIssuedAfter.toString()).toBe(sUSDToMintInWei.toString());

  // then
  const sUSDAfter = await sUSDContract.balanceOf(wallet.address);
  expect(fromWei(sUSDAfter)).toBe(fromWei(sUSDToMintInWei));
});
```

### Exchange from sUSD to sXAU

```js
// ../tests/synthetix.test.ts#L148-L180

test("exchange from sUSD to sXAU", async () => {
  // given
  const sUSDBefore = await sUSDContract.balanceOf(wallet.address);
  const sXAUBefore = await sXAUContract.balanceOf(wallet.address);
  expect(fromWei(sXAUBefore)).toBe("0.0");

  const sUSDToSell = 50;
  const sUSDToSellInWei = parseEther(sUSDToSell.toString());

  const expectedXAUToBuy = await exchangeRatesContract.effectiveValue(
    sUSDKey,
    sUSDToSellInWei,
    sXAUKey,
  );

  // when
  const src = sUSDKey;
  const fromAmount = parseEther(sUSDToSell.toString());
  const dest = sXAUKey;
  await synthetixContract.exchange(src, fromAmount, dest, {
    gasLimit: 4000000,
  });

  // then
  const sUSDAfter = await sUSDContract.balanceOf(wallet.address);
  const sUSDLost = parseFloat(fromWei(sUSDBefore.sub(sUSDAfter)));
  const sXAUAfter = await sXAUContract.balanceOf(wallet.address);

  expect(sUSDLost).toBe(sUSDToSell);
  expect(parseFloat(fromWei(sXAUAfter))).toBeCloseTo(
    parseFloat(fromWei(expectedXAUToBuy)),
  );
});
```

### Exchange back sXAU to sUSD

```js
// ../tests/synthetix.test.ts#L182-L201

test("exchange back sXAU to sUSD", async () => {
  // given
  const sXAUBefore = await sXAUContract.balanceOf(wallet.address);
  const waitingPeriod = await exchangerContract.waitingPeriodSecs();

  await increaseTime(provider, waitingPeriod.toString());
  expect(await synthetixContract.isWaitingPeriod(sXAUKey)).toBe(false);

  // when
  const src = sXAUKey;
  const sourceAmount = sXAUBefore;
  const dest = sUSDKey;
  await synthetixContract.exchange(src, sourceAmount, dest, {
    gasLimit: 4000000,
  });

  // then
  const sXAUAfter = await sXAUContract.balanceOf(wallet.address);
  expect(fromWei(sXAUAfter)).toBe("0.0");
});
```
