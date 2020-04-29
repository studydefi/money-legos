import medianizerAbi from "./abi/Medianizer.json";
import osmAbi from "./abi/OSM.json";

const priceFeeds = {
  ethUsdPriceFeed: {
    address: "0x81FE72B5A8d1A857d176C3E7d5Bd2679A9B85763",
    abi: osmAbi,
  },
  mkrUsdPriceFeed: {
    address: "0x99041F808D598B782D5a3e498681C2452A31da08",
    abi: medianizerAbi,
  },
  batUsdPriceFeed: {
    address: "0xB4eb54AF9Cc7882DF0121d26c5b97E802915ABe6",
    abi: osmAbi,
  },
};

export default priceFeeds;
