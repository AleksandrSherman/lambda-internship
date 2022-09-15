import { CoinBaseApi, CryptoCoinBaseApi } from "./coinBaseApi.js";
import { CoinMarketApi, CryptoCoinMarketApi } from "./coinMarketApi.js";
import { CoinStatsApi, CryptoCoinStats } from "./coinStats.js";

export interface CurrencyInfo {
  site: string;
  symbol: string;
  priceUsd: number;
}

export class CryptoCurrencyApi {
  private coinMarketResponse: CoinMarketApi;
  private coinBaseResponse: CoinBaseApi;
  private coinStatsResponse: CoinStatsApi;

  constructor() {}

  public async getResponses(){
    const coinMarket = new CryptoCoinMarketApi();
    this.coinMarketResponse = await coinMarket.getResponse();

    const coinBase = new CryptoCoinBaseApi();
    this.coinBaseResponse = await coinBase.getResponse();

    const coinStats = new CryptoCoinStats();
    this.coinStatsResponse = await coinStats.getResponse();
  }

  public async mapResponses(): Promise<CurrencyInfo[]> {
    const currencies: CurrencyInfo[] = [];
    this.coinMarketResponse.data.data.forEach((el) => {
      const currency: CurrencyInfo = {
        site: "CoinMarket",
        symbol: el.symbol,
        priceUsd: +el.quote.USD.price,
      };

      currencies.push(currency);
    });
  
    const coinBaseObject = this.coinBaseResponse.data.data.rates;
    for (const key in coinBaseObject) {
      const currency: CurrencyInfo = {
        site: "CoinBase",
        symbol: key,
        priceUsd: 1 / +(coinBaseObject[key]),
      };

      currencies.push(currency);
    }

    this.coinStatsResponse.data.coins.forEach((el) => {
      const currency: CurrencyInfo = {
        site: "CoinStats",
        symbol: el.symbol,
        priceUsd: +el.price,
      };

      currencies.push(currency);
    });

    return currencies;
  }
}
