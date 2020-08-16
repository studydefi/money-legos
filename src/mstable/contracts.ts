import Masset from "./abi/Masset.json";
import MetaToken from "./abi/MetaToken.json";
import MassetValidationHelper from "./abi/MassetValidationHelper.json";
import ForgeValidator from "./abi/ForgeValidator.json";
import BasketManager from "./abi/BasketManager.json";
import AaveIntegration from "./abi/AaveIntegration.json";
import CompoundIntegration from "./abi/CompoundIntegration.json";
import Nexus from "./abi/Nexus.json";
import DelayedProxyAdmin from "./abi/DelayedProxyAdmin.json";
import SavingsManager from "./abi/SavingsManager.json";
import SavingsContract from "./abi/SavingsContract.json";
import RewardsDistributor from "./abi/RewardsDistributor.json";

const contracts = {
  mUSD: {
    symbol: "mUSD",
    decimals: 18,
    abi: Masset,
    address: "0xe2f2a5C287993345a840Db3B0845fbC70f5935a5",
  },
  MTA: {
    abi: MetaToken,
    address: "0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2",
  },
  MassetValidationHelper: {
    abi: MassetValidationHelper,
    address: "0xabcc93c3be238884cc3309c19afd128fafc16911",
  },
  ForgeValidator: {
    abi: ForgeValidator,
    address: "0xbB90D06371030fFa150E463621c22950b212eaa1",
  },
  BasketManager: {
    abi: BasketManager,
    address: "0x66126B4aA2a1C07536Ef8E5e8bD4EfDA1FdEA96D",
  },
  AaveIntegration: {
    abi: AaveIntegration,
    address: "0xf617346a0fb6320e9e578e0c9b2a4588283d9d39",
  },
  CompoundIntegration: {
    abi: CompoundIntegration,
    address: "0xd55684f4369040c12262949ff78299f2bc9db735",
  },
  Nexus: {
    abi: Nexus,
    address: "0xAFcE80b19A8cE13DEc0739a1aaB7A028d6845Eb3",
  },
  DelayedProxyAdmin: {
    abi: DelayedProxyAdmin,
    address: "0x5C8eb57b44C1c6391fC7a8A0cf44d26896f92386",
  },
  SavingsManager: {
    abi: SavingsManager,
    address: "0x7046b0bfc4c5eeb90559c0805dd9c1a6f4815370",
  },
  SavingsContract: {
    abi: SavingsContract,
    address: "0xcf3f73290803fc04425bee135a4caeb2bab2c2a1",
  },
  RewardsDistributor: {
    abi: RewardsDistributor,
    address: "0x04dfdfa471b79cc9e6e8c355e6c71f8ec4916c50",
  },
};

export default contracts;
