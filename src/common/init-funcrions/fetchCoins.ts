import axios, { AxiosError } from "axios";
// import rateLimit from "axios-rate-limit";
import config from "../../config/config";
import { Logger } from "../../config/logger";
import { CoinsDoc } from "../../modules/CryptoCoins/entity/interface";
import CryptoCoins from "../../modules/CryptoCoins/entity/model";

export const fetchCoins = async function () {
  // check if coins already exists
  if ((await CryptoCoins.countDocuments()) > 0) {
    Logger.info("Coins already added");
    return;
  }

  // const http = rateLimit(axios.create(), {
  //   maxRequests: 1,
  //   perMilliseconds: 50000,
  //   maxRPS: 1,
  // });
  // http.getMaxRPS();

  const data = await axios
    .get(
      `${config.crypto.latestUrl}?cryptocurrency_type=all&sort=market_cap&start=1&limit=200`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": config.crypto.key,
        },
      }
    )
    .then(async (data) => {
      // Handle successful response
      console.log("here");
      const cryptoData: CoinsDoc[] = data.data.data;
      for (var i = 0; i < cryptoData.length; i++) {
        cryptoData[
          i
        ].photoPath = `https://s2.coinmarketcap.com/static/img/coins/64x64/${cryptoData[i].id}.png`;
      }

      //   const insertData: CoinsDoc[] = [];
      await CryptoCoins.insertMany(cryptoData);
      Logger.info("Successfully Added Crypto Data");
    })
    .catch((error: AxiosError) => {
      if (axios.isAxiosError(error)) {
        // AxiosError-specific handling
        console.error("Axios Error:", error.message);
        console.error("HTTP Status:", error.response?.status);
      } else {
        // Handle other errors (e.g., network errors)
        console.error("Network Error:", error);
      }
    });
  return;
};
