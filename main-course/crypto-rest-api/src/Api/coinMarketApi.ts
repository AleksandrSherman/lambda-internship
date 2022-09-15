import axios from "axios";
import MarketApi from "./marketApi.js";

export interface CoinMarketCoin {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: Date;
  tags: string[];
  max_supply: number;
  circulating_supply: number;
  total_supply: number;
  platform?: null;
  cmc_rank: number;
  self_reported_circulating_supply?: null;
  self_reported_market_cap?: null;
  tvl_ratio?: null;
  last_updated: Date;
  quote: {
    [key: string]: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      tvl?: null;
      last_updated: Date;
    };
  };
}

export interface CoinMarketApi {
  data: {
    status: {
      timestamp: Date;
      error_code: number;
      error_message?: string | null;
      elapsed: number;
      credit_count: number;
      notice?: string | null;
      total_count: number;
    };
    data: CoinMarketCoin[];
  };
}

export class CryptoCoinMarketApi extends MarketApi<CoinMarketApi> {
  private responseCoinMarket: CoinMarketApi;

  public async getResponse(): Promise<CoinMarketApi> {
    this.responseCoinMarket = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": "a608e38c-a9c4-46f7-9afe-9efb5949c6ed",
        },
      }
    );
    return this.responseCoinMarket;
  }
}
