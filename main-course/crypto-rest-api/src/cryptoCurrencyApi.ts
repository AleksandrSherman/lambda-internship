import axios from "axios";

export interface CurrencyInfo {
  site: string;
  symbol: string;
  priceUsd: number;
}

export class CryptoCurrencyApi {
  private currencies: CurrencyInfo[] = [];
  private responseCoinMarket: any;
  private responseCoinBase: any;
  private responseCoinStats: any;

  constructor() {}

  public async getAllResponses(): Promise<void> {
    this.responseCoinMarket = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": "a608e38c-a9c4-46f7-9afe-9efb5949c6ed",
        },
      }
    );
    this.responseCoinBase = await axios.get(
      "https://api.coinbase.com/v2/exchange-rates"
    );
    this.responseCoinStats = await axios.get(
      "https://api.coinstats.app/public/v1/coins"
    );
  }

  public mapResponses(): CurrencyInfo[] {
    this.responseCoinMarket.data.data.forEach((el) => {
      const currency: CurrencyInfo = {
        site: "CoinMarket",
        symbol: el.symbol,
        priceUsd: el.quote.USD.price,
      };
      this.currencies.push(currency);
    });

    const coinBaseObject = this.responseCoinBase.data.data.rates;
    for (const key in coinBaseObject) {
      const currency: CurrencyInfo = {
        site: "CoinBase",
        symbol: key,
        priceUsd: 1 / coinBaseObject[key],
      };
      this.currencies.push(currency);
    }

    this.responseCoinStats.data.coins.forEach((el) => {
      const currency: CurrencyInfo = {
        site: "CoinStats",
        symbol: el.symbol,
        priceUsd: el.price,
      };
      this.currencies.push(currency);
    });

    return this.currencies;
  }

  
}
