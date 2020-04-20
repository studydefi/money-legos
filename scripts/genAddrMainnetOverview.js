const json2md = require("json2md");
const { legos } = require("../dist");

const prettyTitle = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const formatToEtherscanLink = (l) =>
  `[${l}](https://etherscan.io/address/${l})`;

// Funky protocols with different structures
// Need to construct the markdown a bit differently
const funkyProtocols = ["curvefi"];
const noRenderProtocols = ["dappsys"];

// Generated markdown
const markdown = [{ h1: "Mainnet Address Overview" }];

// Builds the overview page
Object.keys(legos)
  .sort()
  .forEach((curDefiProtocol) => {
    // Don't wanna render these defi libraries
    if (noRenderProtocols.includes(curDefiProtocol.toLowerCase())) {
      return;
    }

    markdown.push({
      h2: prettyTitle(curDefiProtocol),
    });

    markdown.push({
      link: {
        title: 'Link to ABIs',
        source: `https://github.com/studydefi/money-legos/tree/master/src/${curDefiProtocol}/abi`
      },
    });

    const contracts = legos[curDefiProtocol];

    // If its a funky protocol, we need to do some custom formatting
    // E.g. curveFi, where it has multiple contracts, each for a different
    //
    if (funkyProtocols.includes(curDefiProtocol.toLowerCase())) {
      Object.keys(contracts)
        .sort()
        .forEach((outerContractName) => {
          const ul = [];

          const innerContracts = contracts[outerContractName];

          Object.keys(innerContracts)
            .sort()
            .forEach((innerContractName) => {
              const innerContract = innerContracts[innerContractName];
              if (Object.keys(innerContract).includes("address")) {
                ul.push(
                  `${innerContractName}: ${formatToEtherscanLink(
                    innerContract["address"],
                  )}`,
                );
              }
            });

          if (ul.length > 0) {
            markdown.push({
              h4: `${outerContractName}`,
            });
            markdown.push({ ul });
          }
        });
    }
    // If its a single contract with no one (e.g. oneSplit)
    else if (Object.keys(contracts).includes("address")) {
      const ul = [
        `${curDefiProtocol}: ${formatToEtherscanLink(contracts["address"])}`,
      ];
      markdown.push({ ul });
    }
    // Standard format
    else {
      const ul = [];

      // Otherwise we can just get k/v from the contracts key
      Object.keys(contracts)
        .sort()
        .forEach((contractName) => {
          // Quick reference
          const contract = contracts[contractName];

          // If the current key has "contract" in it
          if (Object.keys(contract).includes("address")) {
            ul.push(
              `${contractName}: ${formatToEtherscanLink(contract["address"])}`,
            );
          }
        });

      markdown.push({ ul });
    }
  });

console.log(json2md(markdown));
