import soloMarginAbi from "./abi/SoloMargin.json";
import payableProxyForSoloMarginAbi from "./abi/PayableProxyForSoloMargin.json";
import polynomialInterestSetterAbi from "./abi/PolynomialInterestSetter.json";
import expiryAbi from "./abi/Expiry.json";
import expiryV2Abi from "./abi/ExpiryV2.json";
import daiPriceOracleAbi from "./abi/DaiPriceOracle.json";
import saiPriceOracleAbi from "./abi/SaiPriceOracle.json";
import wethPriceOracleAbi from "./abi/WethPriceOracle.json";
import usdcPriceOracleAbi from "./abi/UsdcPriceOracle.json";
import adminImplAbi from "./abi/AdminImpl.json";
import operationImplAbi from "./abi/OperationImpl.json";
import liquidatorProxyV1ForSoloMarginAbi from "./abi/LiquidatorProxyV1ForSoloMargin.json";
import limitOrdersAbi from "./abi/LimitOrders.json";
import stopLimitOrdersAbi from "./abi/StopLimitOrders.json";
import canonicalOrdersAbi from "./abi/CanonicalOrders.json";
import signedOperationProxyAbi from "./abi/SignedOperationProxy.json";
import refunderAbi from "./abi/Refunder.json";

import networks from "../networks";

const contracts = {
  soloMargin: {
    address: {
      [networks.mainnet]: "0x1e0447b19bb6ecfdae1e4ae1694b0c3659614e4e",
    },
    abi: soloMarginAbi,
  },
  payableProxyForSoloMargin: {
    abi: payableProxyForSoloMarginAbi,
    address: {
      [networks.mainnet]: "0xa8b39829cE2246f89B31C013b8Cde15506Fb9A76",
    },
  },
  polynomialInterestSetter: {
    abi: polynomialInterestSetterAbi,
    address: {
      [networks.mainnet]: "0xaEE83ca85Ad63DFA04993adcd76CB2B3589eCa49",
    },
  },
  expiry: {
    abi: expiryAbi,
    address: {
      [networks.mainnet]: "0x0ECE224FBC24D40B446c6a94a142dc41fAe76f2d",
    },
  },
  expiryV2: {
    abi: expiryV2Abi,
    address: {
      [networks.mainnet]: "0x739A1DF6725657f6a16dC2d5519DC36FD7911A12",
    },
  },
  daiPriceOracle: {
    abi: daiPriceOracleAbi,
    address: {
      [networks.mainnet]: "0x0fBd14718d8FAB8f9f40Ee5c5612b1F0717100A2",
    },
  },
  saiPriceOracle: {
    abi: saiPriceOracleAbi,
    address: {
      [networks.mainnet]: "0x787F552BDC17332c98aA360748884513e3cB401a",
    },
  },
  wethPriceOracle: {
    abi: wethPriceOracleAbi,
    address: {
      [networks.mainnet]: "0xf61AE328463CD997C7b58e7045CdC613e1cFdb69",
    },
  },
  usdcPriceOracle: {
    abi: usdcPriceOracleAbi,
    address: {
      [networks.mainnet]: "0x52f1c952A48a4588f9ae615d38cfdbf8dF036e60",
    },
  },
  adminImpl: {
    abi: adminImplAbi,
    address: {
      [networks.mainnet]: "0x8a6629fEba4196E0A61B8E8C94D4905e525bc055",
    },
  },
  operationImpl: {
    abi: operationImplAbi,
    address: {
      [networks.mainnet]: "0x56E7d4520ABFECf10b38368b00723d9BD3c21ee1",
    },
  },
  liquidatorProxyV1ForSoloMargin: {
    abi: liquidatorProxyV1ForSoloMarginAbi,
    address: {
      [networks.mainnet]: "0xD4B6cd147ad8A0D5376b6FDBa85fE8128C6f0686",
    },
  },
  limitOrders: {
    abi: limitOrdersAbi,
    address: {
      [networks.mainnet]: "0xDEf136D9884528e1EB302f39457af0E4d3AD24EB",
    },
  },
  stopLimitOrders: {
    abi: stopLimitOrdersAbi,
    address: {
      [networks.mainnet]: "0xbFb635e8c6689ac3874aD9A60FaB1c29270f1710",
    },
  },
  canonicalOrders: {
    abi: canonicalOrdersAbi,
    address: {
      [networks.mainnet]: "0xCd81398895bEa7AD9EFF273aeFFc41A9d83B4dAD",
    },
  },
  signedOperationProxy: {
    abi: signedOperationProxyAbi,
    address: {
      [networks.mainnet]: "0x2a842bC64343FAD4Ec4a8424ba7ff3c0A70b6e55",
    },
  },
  refunder: {
    abi: refunderAbi,
    address: {
      [networks.mainnet]: "0x7454dF5d0758D4E7A538c3aCF4841FA9137F0f74",
    },
  },
};

export default contracts;
