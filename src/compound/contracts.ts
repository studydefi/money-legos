import ComptrollerAbi from "./abi/Comptroller.json";
import CompoundPriceOracleAbi from "./abi/CompoundPriceOracle.json";
import CTokenAbi from "./abi/CToken.json";
import CEtherAbi from "./abi/CEther.json";

const contracts = {
  cToken: { abi: CTokenAbi },
  comptroller: {
    address: "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b",
    abi: ComptrollerAbi,
  },
  priceOracle: {
    address: "0xDDc46a3B076aec7ab3Fc37420A8eDd2959764Ec4",
    abi: CompoundPriceOracleAbi,
  },
  cEther: {
    decimals: 8,
    address: "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5",
    abi: CEtherAbi,
  },
  cDAI: {
    decimals: 8,
    address: "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
    abi: CTokenAbi,
  },
  cSAI: {
    decimals: 8,
    address: "0xf5dce57282a584d2746faf1593d3121fcac444dc",
    abi: CTokenAbi,
  },
  cBAT: {
    decimals: 8,
    address: "0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e",
    abi: CTokenAbi,
  },
  cZRX: {
    decimals: 8,
    address: "0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407",
    abi: CTokenAbi,
  },
  cUSDC: {
    decimals: 8,
    address: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
    abi: CTokenAbi,
  },
  cREP: {
    decimals: 8,
    address: "0x158079ee67fce2f58472a96584a73c7ab9ac95c1",
    abi: CTokenAbi,
  },
  cWBTC: {
    decimals: 8,
    address: "0xc11b1268c1a384e55c48c2391d8d480264a3a7f4",
    abi: CTokenAbi,
  },
};

export default contracts;
