const path = require("path");
const fs = require("fs");

// Usage: node scripts/getAbisFromUMA.js <path-to-uma-protocol>

// only include the following contracts
const fileFilter = [
  "Finder",
  "VotingToken",
  "IdentifierWhitelist",
  "Voting",
  "Registry",
  "FinancialContractsAdmin",
  "Store",
  "Governor",
  "DesignatedVotingFactory",
  "WETH9",
  "ExpiringMultiPartyLib",
  "ExpiringMultiParty",
  "TokenFactory",
  "AddressWhitelist",
  "ExpiringMultiPartyCreator",
];

// get all JSON files from their artifacts directory
const inputPath = process.argv[2];
const artifactPath = path.join(inputPath, "./core/build/contracts");
const filenames = fs.readdirSync(artifactPath);

// create a fresh temp folder to hold ABIs
const outputDir = path.join(process.cwd(), "./src/uma/abi");
if (fs.existsSync(outputDir)) {
  fs.rmdirSync(outputDir, { recursive: true });
}
fs.mkdirSync(outputDir);

// write ABIs to new files
filenames.forEach((filename) => {
  const contents = require(path.join(artifactPath, filename));
  const name = filename.split(".").slice(0, -1).join(".");

  if (fileFilter.includes(name)) {
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, JSON.stringify(contents.abi, null, 2));
    console.log("written:", outputPath);
  }
});
