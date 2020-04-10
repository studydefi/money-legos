import { default as erc20 } from "./modules/erc20";
import { default as compound } from "./modules/compound";
import { default as maker } from "./modules/maker";
import { default as uniswap } from "./modules/uniswap";

export const rawLegos = {
  erc20,
  compound,
  maker,
  uniswap
};

export const getLegosFor = (networkId: number) => {
  return changeAddressValue(networkId, rawLegos);
};

const isValidObject = (obj: unknown) => typeof obj === "object" && obj !== null;

// Recursively goes through each field, and changes the address value to the specific value
// i.e. compound.cDai.address[mainnet] = 0x...
//      becomes:
//      compound.cDai.address = 0x....
function changeAddressValue(networkId: number, immutableObj: any) {
  let obj = immutableObj;

  // recursive base case
  if (!isValidObject(immutableObj)) {
    return obj;
  }

  // desctructure the object to create new reference
  obj = { ...immutableObj };
  // iterating over the object using for..in
  for (const keys in obj) {
    //checking if the current value is an object itself
    if (isValidObject(obj[keys])) {
      if (`${keys}` === "address" && obj[keys][`${networkId}`] !== undefined) {
        // else getting the value and replacing with specified network id
        const keyValue = obj[keys][`${networkId}`];
        obj[keys] = keyValue || null;
      } else if (!Array.isArray(obj[keys])) {
        // Don't wanna modify arrays
        obj[keys] = changeAddressValue(networkId, obj[keys]);
      }
    }
    return obj;
  }
}
