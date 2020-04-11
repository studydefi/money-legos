import { getLegosFor, changeAddressValue } from "./legos";
import networks from "./networks";

test("can get legos for mainnet", () => {
  const legos = getLegosFor(networks.mainnet);
  expect(legos).toMatchSnapshot();
});

describe("recursive changeAddressValue function", () => {
  test("can replace address value", () => {
    const input = {
      foo: {
        address: {
          [networks.mainnet]: "mainnet foo address",
          [networks.ropsten]: "ropsten foo address",
        },
      },
    };
    expect(changeAddressValue(networks.mainnet, input as any)).toStrictEqual({
      foo: { address: "mainnet foo address" },
    });
  });

  test("can replace nested address value", () => {
    const input = {
      foo: {
        bar: {
          address: {
            [networks.mainnet]: "mainnet foo.bar address",
            [networks.ropsten]: "ropsten foo.bar address",
          },
        },
      },
    };
    expect(changeAddressValue(networks.ropsten, input as any)).toStrictEqual({
      foo: { bar: { address: "ropsten foo.bar address" } },
    });
  });
});
