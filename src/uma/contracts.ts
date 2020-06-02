import addressWhitelistAbi from "./abi/AddressWhitelist.json";
import designatedVotingFactoryAbi from "./abi/DesignatedVotingFactory.json";
import expiringMultiPartyLibAbi from "./abi/expiringMultiPartyLib.json";
import expiringMultiPartyCreatorAbi from "./abi/ExpiringMultiPartyCreator.json";
import financialContractsAdminAbi from "./abi/FinancialContractsAdmin.json";
import finderAbi from "./abi/Finder.json";
import governorAbi from "./abi/Governor.json";
import identifierWhitelistAbi from "./abi/IdentifierWhitelist.json";
import registryAbi from "./abi/Registry.json";
import storeAbi from "./abi/Store.json";
import votingAbi from "./abi/Voting.json";
import votingTokenAbi from "./abi/VotingToken.json";
import weth9Abi from "./abi/WETH9.json";
import tokenFactoryAbi from "./abi/TokenFactory.json";

const contracts = {
  addressWhitelist: {
    abi: addressWhitelistAbi,
    address: "0x48e687205D3962c43891b8Cde5A4Fe75FA6C8D7a",
  },
  designatedVotingFactory: {
    abi: designatedVotingFactoryAbi,
    address: "0xE81EeE5Da165fA6863bBc82dF66E62d18625d592",
  },
  expiringMultiPartyLib: {
    abi: expiringMultiPartyLibAbi,
    address: "0x09AFD24Acc170c16f4fF64BDf2A4818C515440e8",
  },
  expiringMultiPartyCreator: {
    abi: expiringMultiPartyCreatorAbi,
    address: "0xdebB91Ab3e473025bb8ce278c02361A3C4f13124",
  },
  financialContractsAdmin: {
    abi: financialContractsAdminAbi,
    address: "0x4E6CCB1dA3C7844887F9A5aF4e8450d9fd90317A",
  },
  finder: {
    abi: finderAbi,
    address: "0x40f941E48A552bF496B154Af6bf55725f18D77c3",
  },
  governor: {
    abi: governorAbi,
    address: "0x592349F7DeDB2b75f9d4F194d4b7C16D82E507Dc",
  },
  identifierWhitelist: {
    abi: identifierWhitelistAbi,
    address: "0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570",
  },
  registry: {
    abi: registryAbi,
    address: "0x3e532e6222afe9Bcf02DCB87216802c75D5113aE",
  },
  store: {
    abi: storeAbi,
    address: "0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF",
  },
  tokenFactory: {
    abi: tokenFactoryAbi,
    address: "0x7c96d6235CfaaCcAc5d80fCe74E6032B25dd1F03",
  },
  voting: {
    abi: votingAbi,
    address: "0x9921810C710E7c3f7A7C6831e30929f19537a545",
  },
  votingToken: {
    abi: votingTokenAbi,
    address: "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828",
  },
  weth9: {
    abi: weth9Abi,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
};

export default contracts;
