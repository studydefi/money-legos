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
          [networks.mainnet]: "mainnet_foo_address",
          [networks.ropsten]: "ropsten_foo_address",
        },
      },
    };
    expect(changeAddressValue(networks.mainnet, input as any)).toStrictEqual({
      foo: { address: "mainnet_foo_address" },
    });
  });

  test("can replace nested address value", () => {
    const input = {
      foo: {
        bar: {
          address: {
            [networks.mainnet]: "mainnet_foo.bar_address",
            [networks.ropsten]: "ropsten_foo.bar_address",
          },
        },
      },
    };
    expect(changeAddressValue(networks.ropsten, input as any)).toStrictEqual({
      foo: { bar: { address: "ropsten_foo.bar_address" } },
    });
  });

  test("can replace address value multiple times", () => {
    const input = {
      foo: { address: { [networks.mainnet]: "mainnet_foo_address" } },
      bar: { address: { [networks.mainnet]: "mainnet_bar_address" } },
    };
    expect(changeAddressValue(networks.mainnet, input as any)).toStrictEqual({
      foo: { address: "mainnet_foo_address" },
      bar: { address: "mainnet_bar_address" },
    });
  });

  test("use null if address for network does not exist", () => {
    const input = {
      foo: { address: { [networks.mainnet]: "mainnet_foo_address" } },
      bar: { address: { [networks.mainnet]: "mainnet_bar_address" } },
      baz: { address: { [networks.mainnet]: "mainnet_baz_address" } },
    };
    expect(changeAddressValue(networks.ropsten, input as any)).toStrictEqual({
      foo: { address: null },
      bar: { address: null },
      baz: { address: null },
    });
  });
});
