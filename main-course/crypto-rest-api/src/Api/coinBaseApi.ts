import axios from "axios";
import MarketApi from "./marketApi.js";

export interface CoinBaseApi {
  data: {
    data: {
      currency: string,
      rates: {
        [key: string]: string
      }
    }
  }
}

export class CryptoCoinBaseApi extends MarketApi<CoinBaseApi> {
  private responseCoinBase: CoinBaseApi;

  public async getResponse(): Promise<CoinBaseApi> {
    this.responseCoinBase = await axios.get(
      "https://api.coinbase.com/v2/exchange-rates"
    );
    return this.responseCoinBase;
  }
}
