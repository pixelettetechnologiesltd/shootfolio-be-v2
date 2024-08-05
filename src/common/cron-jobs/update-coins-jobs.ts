import axios, { AxiosError } from "axios";
import config from "../../config/config";
import { CoinsDoc } from "../../modules/CryptoCoins/entity/interface";
import CryptoCoins from "../../modules/CryptoCoins/entity/model";
import { Logger } from "../../config/logger";

export const updateCoins = async function () {
  // fetch coins API
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
      const cryptoData: CoinsDoc[] = data.data.data;

      for (let i = 0; i < cryptoData.length; i++) {
        const doc = await CryptoCoins.findOne({ id: cryptoData[i].id });
        if (doc) {
          Object.assign(doc, cryptoData[i]);
          await doc.save();
        }
      }
      Logger.info("Coin data updated successfuylly");
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
