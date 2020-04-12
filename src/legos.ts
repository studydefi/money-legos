import { default as curvefi } from "./curvefi";
import { default as dappsys } from "./dappsys";
import { default as erc20 } from "./erc20";
import { default as compound } from "./compound";
import { default as maker } from "./maker";
import { default as onesplit } from "./onesplit";
import { default as uniswap } from "./uniswap";

export const rawLegos = {
  curvefi,
  dappsys,
  erc20,
  compound,
  maker,
  onesplit,
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
    [x: number]: string;
  };
};

type MappingToChangeTo = {
  address: string;
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

type DeepOmit<T> = T extends Primitive ? T : DeepOmitHelper<T>;

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
export const changeAddressValue = (
  networkId: number,
  immutableObj: RawLegos,
): RawLegosWithoutNetworkId => {
  let obj = immutableObj as any;

  // recursive base case, stop here
  if (!isValidObject(immutableObj)) {
    return obj;
  }

  // desctructure the object to create new reference
  obj = { ...immutableObj };
  // iterating over the object using for..in
  for (const key in obj) {
    if (Array.isArray(obj[key])) continue; // ignore arrays (e.g. ABIs)
    if (!isValidObject(obj[key])) continue; // ignore non-valid objects

    if (key === "address") {
      obj[key] = obj.address[networkId] || null;
    } else {
      obj[key] = changeAddressValue(networkId, obj[key]);
    }
  }
  return obj;
};
