import ATokenAbi from "./abi/AToken.json";
import LendingPoolAbi from "./abi/LendingPool.json";
import LendingPoolAddressesProviderAbi from "./abi/LendingPoolAddessProvider.json";
import LendingPoolCoreAbi from "./abi/LendingPoolCore.json";

const contracts = {
  ATokenAbi,
  LendingPoolAddressesProvider: {
    abi: LendingPoolAddressesProviderAbi,
    address: "0x24a42fd28c976a61df5d00d0599c34c4f90748c8",
  },
  LendingPool: {
    abi: LendingPoolAbi,
    address: "0x398ec7346dcd622edc5ae82352f02be94c62d119",
  },
  LendingPoolCore: {
    abi: LendingPoolCoreAbi,
    address: "0x3dfd23a6c5e8bbcfc9581d2e864a68feb6a076d3",
  },
  aETH: {
    address: "0x3a3a65aab0dd2a17e3f1947ba16138cd37d08c04",
    abi: ATokenAbi,
    decimals: 18,
  },
  aDAI: {
    address: "0xfc1e690f61efd961294b3e1ce3313fbd8aa4f85d",
    abi: ATokenAbi,
    decimals: 18,
  },
  aUSDC: {
    address: "0x9ba00d6856a4edf4665bca2c2309936572473b7e",
    abi: ATokenAbi,
    decimals: 6,
  },
  aSUSD: {
    address: "0x625ae63000f46200499120b906716420bd059240",
    abi: ATokenAbi,
    decimals: 18,
  },
  aTUSD: {
    address: "0x4da9b813057d04baef4e5800e36083717b4a0341",
    abi: ATokenAbi,
    decimals: 18,
  },
  aUSDT: {
    address: "0x71fc860f7d3a592a4a98740e39db31d25db65ae8",
    abi: ATokenAbi,
    decimals: 6,
  },
  aBUSD: {
    address: "0x6ee0f7bb50a54ab5253da0667b0dc2ee526c30a8",
    abi: ATokenAbi,
    decimals: 18,
  },
  aBAT: {
    address: "0xe1ba0fb44ccb0d11b80f92f4f8ed94ca3ff51d00",
    abi: ATokenAbi,
    decimals: 18,
  },
  aKNC: {
    address: "0x9d91be44c06d373a8a226e1f3b146956083803eb",
    abi: ATokenAbi,
    decimals: 18,
  },
  aLEND: {
    address: "0x7d2d3688df45ce7c552e19c27e007673da9204b8",
    abi: ATokenAbi,
    decimals: 18,
  },
  aLINK: {
    address: "0xa64bd6c70cb9051f6a9ba1f163fdc07e0dfb5f84",
    abi: ATokenAbi,
    decimals: 18,
  },
  aMANA: {
    address: "0x6fce4a401b6b80ace52baaefe4421bd188e76f6f",
    abi: ATokenAbi,
    decimals: 18,
  },
  aMKR: {
    address: "0x7deb5e830be29f91e298ba5ff1356bb7f8146998",
    abi: ATokenAbi,
    decimals: 18,
  },
  aREP: {
    address: "0x71010a9d003445ac60c4e6a7017c1e89a477b438",
    abi: ATokenAbi,
    decimals: 18,
  },
  aSNX: {
    address: "0x328c4c80bc7aca0834db37e6600a6c49e12da4de",
    abi: ATokenAbi,
    decimals: 18,
  },
  aWBTC: {
    address: "0xfc4b8ed459e00e5400be803a9bb3954234fd50e3",
    abi: ATokenAbi,
    decimals: 8,
  },
  aZRX: {
    address: "0x6fb0855c404e09c47c3fbca25f08d4e41f9f062f",
    abi: ATokenAbi,
    decimals: 18,
  },
};

export default contracts;
