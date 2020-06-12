import ProxyERC20Abi from "./abi/ProxyERC20.json";
import SynthAbi from "./abi/Synth.json";
import SynthetixAbi from "./abi/Synthetix.json";
import ExchangeRatesAbi from "./abi/ExchangeRates.json";
import ExchangerAbi from "./abi/Exchanger.json";
import DepotAbi from "./abi/Depot.json";

// Note: All contract addresses and ABIs: https://docs.synthetix.io/addresses/#mainnet-contracts
const contracts = {
  Synthetix: {
    abi: SynthetixAbi,
    address: "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F",
  },
  ExchangeRates: {
    abi: ExchangeRatesAbi,
    address: "0x9D7F70AF5DF5D5CC79780032d47a34615D1F1d77",
  },
  Exchanger: {
    abi: ExchangerAbi,
    address: "0x7Dfe5aa8fc36c0Ae788a3a71062728bFc3036216",
  },
  Depot: {
    abi: DepotAbi,
    address: "0xE1f64079aDa6Ef07b03982Ca34f1dD7152AA3b86",
  },
  iADA: {
    address: "0x8A8079c7149B8A1611e5C5d978DCA3bE16545F83",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iBCH: {
    address: "0xf6E9b246319ea30e8C2fA2d1540AAEBF6f9E1B89",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iBNB: {
    address: "0xAFD870F32CE54EfdBF677466B612bf8ad164454B",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iBTC: {
    address: "0xD6014EA05BDe904448B743833dDF07c3C7837481",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iCEX: {
    address: "0x336213e1DDFC69f4701Fc3F86F4ef4A160c1159d",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iDASH: {
    address: "0xCB98f42221b2C251A4E74A1609722eE09f0cc08E",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iDEFI: {
    address: "0x14d10003807AC60d07BB0ba82cAeaC8d2087c157",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iEOS: {
    address: "0xF4EebDD0704021eF2a6Bbe993fdf93030Cd784b4",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iETC: {
    address: "0xd50c1746D835d2770dDA3703B69187bFfeB14126",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iETH: {
    address: "0xA9859874e1743A32409f75bB11549892138BBA1E",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iLINK: {
    address: "0x2d7aC061fc3db53c39fe1607fB8cec1B2C162B01",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iLTC: {
    address: "0x79da1431150C9b82D2E5dfc1C68B33216846851e",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iTRX: {
    address: "0xC5807183a9661A533CB08CbC297594a0B864dc12",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iXMR: {
    address: "0x4AdF728E2Df4945082cDD6053869f51278fae196",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iXRP: {
    address: "0x27269b3e45A4D3E79A3D6BFeE0C8fB13d0D711A6",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  iXTZ: {
    address: "0x8deef89058090ac5655A99EEB451a4f9183D1678",
    abi: ProxyERC20Abi,
    decimals: 18,
  },
  sADA: {
    address: "0xe36E2D3c7c34281FA3bC737950a68571736880A1",
    abi: SynthAbi,
    decimals: 18,
  },
  sAUD: {
    address: "0xF48e200EAF9906362BB1442fca31e0835773b8B4",
    abi: SynthAbi,
    decimals: 18,
  },
  sBCH: {
    address: "0x36a2422a863D5B950882190Ff5433E513413343a",
    abi: SynthAbi,
    decimals: 18,
  },
  sBNB: {
    address: "0x617aeCB6137B5108D1E7D4918e3725C8cEbdB848",
    abi: SynthAbi,
    decimals: 18,
  },
  sBTC: {
    address: "0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6",
    abi: SynthAbi,
    decimals: 18,
  },
  sCEX: {
    address: "0xeABACD844A196D7Faf3CE596edeBF9900341B420",
    abi: SynthAbi,
    decimals: 18,
  },
  sCHF: {
    address: "0x0F83287FF768D1c1e17a42F44d644D7F22e8ee1d",
    abi: SynthAbi,
    decimals: 18,
  },
  sDASH: {
    address: "0xfE33ae95A9f0DA8A845aF33516EDc240DCD711d6",
    abi: SynthAbi,
    decimals: 18,
  },
  sDEFI: {
    address: "0xe1aFe1Fd76Fd88f78cBf599ea1846231B8bA3B6B",
    abi: SynthAbi,
    decimals: 18,
  },
  sEOS: {
    address: "0x88C8Cf3A212c0369698D13FE98Fcb76620389841",
    abi: SynthAbi,
    decimals: 18,
  },
  sETC: {
    address: "0x22602469d704BfFb0936c7A7cfcD18f7aA269375",
    abi: SynthAbi,
    decimals: 18,
  },
  sETH: {
    address: "0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb",
    abi: SynthAbi,
    decimals: 18,
  },
  sEUR: {
    address: "0xD71eCFF9342A5Ced620049e616c5035F1dB98620",
    abi: SynthAbi,
    decimals: 18,
  },
  sFTSE: {
    address: "0x23348160D7f5aca21195dF2b70f28Fce2B0be9fC",
    abi: SynthAbi,
    decimals: 18,
  },
  sGBP: {
    address: "0x97fe22E7341a0Cd8Db6F6C021A24Dc8f4DAD855F",
    abi: SynthAbi,
    decimals: 18,
  },
  sJPY: {
    address: "0xF6b1C627e95BFc3c1b4c9B825a032Ff0fBf3e07d",
    abi: SynthAbi,
    decimals: 18,
  },
  sLINK: {
    address: "0xbBC455cb4F1B9e4bFC4B73970d360c8f032EfEE6",
    abi: SynthAbi,
    decimals: 18,
  },
  sLTC: {
    address: "0xC14103C2141E842e228FBaC594579e798616ce7A",
    abi: SynthAbi,
    decimals: 18,
  },
  sNIKKEI: {
    address: "0x757de3ac6B830a931eF178C6634c5C551773155c",
    abi: SynthAbi,
    decimals: 18,
  },
  sTRX: {
    address: "0xf2E08356588EC5cd9E437552Da87C0076b4970B0",
    abi: SynthAbi,
    decimals: 18,
  },
  sUSD: {
    address: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3",
    abi: SynthAbi,
    decimals: 18,
  },
  sXAG: {
    address: "0x6A22e5e94388464181578Aa7A6B869e00fE27846",
    abi: SynthAbi,
    decimals: 18,
  },
  sXAU: {
    address: "0x261EfCdD24CeA98652B9700800a13DfBca4103fF",
    abi: SynthAbi,
    decimals: 18,
  },
  sXMR: {
    address: "0x5299d6F7472DCc137D7f3C4BcfBBB514BaBF341A",
    abi: SynthAbi,
    decimals: 18,
  },
  sXRP: {
    address: "0xa2B0fDe6D710e201d0d608e924A484d1A5fEd57c",
    abi: SynthAbi,
    decimals: 18,
  },
  sXTZ: {
    address: "0x2e59005c5c0f0a4D77CcA82653d48b46322EE5Cd",
    abi: SynthAbi,
    decimals: 18,
  },
};

export default contracts;
