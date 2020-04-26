const dotenv = require("dotenv");
dotenv.config();

const { ethers } = require("ethers");
const Ganache = require("ganache-core");
const NodeEnvironment = require("jest-environment-node");

const startChain = async () => {
  if (!process.env.PRIV_KEY || !process.env.MAINNET_NODE_URL) {
    throw Error("PRIV_KEY and MAINNET_NODE_URL not found in .env");
  }
  const ganache = Ganache.provider({
    fork: process.env.MAINNET_NODE_URL,
    network_id: 1,
    accounts: [
      {
        secretKey: process.env.PRIV_KEY,
        balance: ethers.utils.hexlify(ethers.utils.parseEther("1000")),
      },
    ],
  });

  const provider = new ethers.providers.Web3Provider(ganache);
  const wallet = new ethers.Wallet(process.env.PRIV_KEY, provider);

  return { wallet, provider };
};

class CustomEnvironment extends NodeEnvironment {
  testPath;
  docblockPragmas;

  // Our own vars
  wallet;
  provider;
  snapshotId;

  constructor(config, context) {
    super(config);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
    this.snapshotId = null;
  }

  async setup() {
    await super.setup();
    if (!this.wallet) {
      const { wallet, provider } = await startChain();
      this.wallet = wallet;
      this.provider = provider;
      this.global.wallet = wallet;
      this.global.provider = provider;
    }

    if (this.snapshotId) {
      await this.provider.send("evm_revert", [this.snapshotId]);
    }

    // take snapshot of current chain state
    this.snapshotId = await this.provider.send("evm_snapshot", []);
    this.global.snapshotId = this.snapshotId;
  }

  async teardown() {
    await super.teardown();
  }

  //@ts-ignore
  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = CustomEnvironment;
