import { task, usePlugin, BuidlerConfig } from "@nomiclabs/buidler/config";
const dotenv = require("dotenv");
dotenv.config();

usePlugin("@nomiclabs/buidler-waffle");
usePlugin("@nomiclabs/buidler-ganache");

// This is a sample Buidler task. To learn how to create your own go to
// https://buidler.dev/guides/create-task.html
// task("accounts", "Prints the list of accounts", async () => {
//   const accounts = await ethers.getSigners();

//   for (const account of accounts) {
//     console.log(await account.getAddress());
//   }
// });

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
const config /*: BuidlerConfig*/ = {
  paths: {
    tests: "./tests",
    sources: "./tests",
  },
  solc: {
    version: "0.5.16",
  },
  defaultNetwork: "ganache",
  mocha: {
    timeout: 0,
  },
  networks: {
    ganache: {
      url: "http://127.0.0.1:8555",
      fork: process.env.MAINNET_NODE_URL,
      network_id: 1,
      timeout: 0,
      logger: console,
    },
  },
};

export default config;
