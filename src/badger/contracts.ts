import AffiliateVault from "./abi/AffiliateVault.json"
import DiggSett from "./abi/DiggSett.json"
import ibBTC from "./abi/ibBTC.json"
import MiniMeToken from "./abi/MiniMeToken.json"
import Sett from "./abi/Sett.json"
import UFragments from "./abi/UFragments.json"

const contracts = {
  // Badger and Digg
  BadgerToken: {
    abi: MiniMeToken,
    address: "0x3472A5A71965499acd81997a54BBA8D852C6E53d",
  },
  DiggToken: {
    abi: UFragments,
    address: "0x798D1bE841a82a273720CE31c822C61a67a601C3",
  },
  bBadgerToken: {
    abi: Sett,
    address: "0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28",
  },
  bDiggToken: {
    abi: DiggSett,
    address: "0x7e7E112A68d8D2E221E11047a72fFC1065c38e1a",
  },
  // Vaults
  //// Uniswap
  native_uniBadgerWbtc: {
    abi: Sett,
    address: "0x235c9e24D3FB2FAFd58a2E49D454Fdcd2DBf7FF1",
  },
  native_uniDiggWbtc: {
    abi: Sett,
    address: "0xC17078FDd324CC473F8175Dc5290fae5f2E84714",
  },
  //// Sushi Swap
  native_sushiWbtcEth: {
    abi: Sett,
    address: "0x758A43EE2BFf8230eeb784879CdcFF4828F2544D",
  },
  native_sushiBadgerWbtc: {
    abi: Sett,
    address: "0x1862A18181346EBd9EdAf800804f89190DeF24a5",
  },
  native_sushiDiggWbtc: {
    abi: Sett,
    address: "0x88128580ACdD9c04Ce47AFcE196875747bF2A9f6",
  },
  //// Yearn
  yearn_wbtc: {
    abi: AffiliateVault,
    address: "0x4b92d19c11435614cd49af1b589001b7c08cd4d5",
  },
  //// Harvest
  harvest_renCrv: {
    abi: Sett,
    address: "0xAf5A1DECfa95BAF63E0084a35c62592B774A2A87",
  },
  //// Curve
  native_cvxCrv: {
    abi: Sett,
    address: "0x2B5455aac8d64C14786c3a29858E43b5945819C0",
  },
  native_cvx: {
    abi: Sett,
    address: "0x53c8e199eb2cb7c01543c137078a038937a68e40",
  },
  native_renCrv: {
    abi: Sett,
    address: "0x6dEf55d2e18486B9dDfaA075bc4e4EE0B28c1545",
  },
  native_sbtcCrv: {
    abi: Sett,
    address: "0xd04c48A53c111300aD41190D63681ed3dAd998eC",
  },
  native_tbtcCrv: {
    abi: Sett,
    address: "0xb9D076fDe463dbc9f915E5392F807315Bf940334",
  },
  native_tricrypto: {
    abi: Sett,
    address: "0xBE08Ef12e4a553666291E9fFC24fCCFd354F2Dd2",
  },
  native_hbtcCrv: {
    abi: Sett,
    address: "0x8c76970747afd5398e958bdfada4cf0b9fca16c4",
  },
  native_pbtcCrv: {
    abi: Sett,
    address: "0x55912d0cf83b75c492e761932abc4db4a5cb1b17",
  },
  native_obtcCrv: {
    abi: Sett,
    address: "0xf349c0faa80fc1870306ac093f75934078e28991",
  },
  native_bbtcCrv: {
    abi: Sett,
    address: "0x5dce29e92b1b939f8e8c60dcf15bde82a85be4a9", 
  },
  //// Others
  experimental_sushiIBbtcWbtc: {
    abi: Sett,
    address: "0x8a8ffec8f4a0c8c9585da95d9d97e8cd6de273de",
  },
  /*
  experimental_digg: {
    abi: StabilizeDiggSett,
    address: "0x608b6D82eb121F3e5C0baeeD32d81007B916E83C",
  },
  */
  //// ibBTC
  ibBTC: {
    abi: ibBTC,
    address: "0xc4E15973E6fF2A35cC804c2CF9D2a1b817a8b40F",
  },
};

export default contracts;
