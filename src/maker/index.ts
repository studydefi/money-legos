import { default as contracts } from "./contracts";
import { default as ilks } from "./ilks";
import { default as priceFeeds } from "./priceFeeds";

export default {
  ...contracts,
  ...ilks,
  ...priceFeeds
};
