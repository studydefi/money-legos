import { default as erc20 } from "./modules/erc20";
import { default as compound } from "./modules/compound";
import { default as maker } from "./modules/maker";
import { default as uniswap } from "./modules/uniswap";
import { default as networks } from "./networks"

export const rawLegos = {
  erc20,
  compound,
  maker,
  uniswap,
};

export const getLegosFor = (networkId: number) => {
  return changeAddressValue(networkId, rawLegos);
};

// This is just so we retain type information after unrolling `address` from `changeAddressValue`
// When we're doing the dynamic "popping" of the "address" key from the Object
// Thanks to https://stackoverflow.com/questions/55539387/deep-omit-with-typescript
type Primitive =
  | string
  | Function
  | number
  | boolean
  | Symbol
  | undefined
  | null;

type MappingToChangeFrom = {
  address: {
    [x: number]: string
  };
};

type MappingToChangeTo = {
  address: string
};

type DeepOmitHelper<T> = {
  [P in keyof T]: T[P] extends infer TP //extra level of indirection needed to trigger homomorhic behavior // distribute over unions
    ? TP extends Primitive
      ? TP // leave primitives and functions alone
      : TP extends any[]
      ? DeepOmitArray<TP> // Array special handling
      : TP extends MappingToChangeFrom // IF type equals to { address: { [networkIds: number]: string } }
      ? Omit<TP, "address"> & MappingToChangeTo // Change to { address: string }
      : DeepOmit<TP>
    : never;
};

type DeepOmit<T> = T extends Primitive
  ? T
  : DeepOmitHelper<T>;

type DeepOmitArray<T extends any[]> = {
  [P in keyof T]: DeepOmit<T[P]>;
};

type RawLegos = typeof rawLegos;
type RawLegosWithoutNetworkId = DeepOmit<RawLegos>;

const isValidObject = (obj: unknown) => typeof obj === "object" && obj !== null;

// Recursively goes through each field, and changes the address value to the specific value
// i.e. compound.cDai.address[mainnet] = 0x...
//      becomes:
//      compound.cDai.address = 0x....
const changeAddressValue = (
  networkId: number,
  immutableObj: RawLegos
): RawLegosWithoutNetworkId => {
  let obj = immutableObj as any;

  // recursive base case
  if (isValidObject(immutableObj)) {
    // desctructure the object to create new reference
    obj = { ...immutableObj };
    // iterating over the object using for..in
    for (const keys in obj) {
      //checking if the current value is an object itself
      if (isValidObject(obj[keys])) {
        if (
          `${keys}` === "address" &&
          obj[keys][`${networkId}`] !== undefined
        ) {
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

  return obj;
};