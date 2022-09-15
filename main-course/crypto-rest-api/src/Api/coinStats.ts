import axios from "axios";
import MarketApi from "./marketApi.js";

export interface CoinStatsCoin{
    id: string,
    icon: string,
    name: string,
    symbol: string,
    rank: number,
    price: number,
    priceBtc: number,
    volume: number,
    marketCap: number,
    availableSupply: number,
    totalSupply: number,
    priceChange1h: number,
    priceChange1d: number,
    priceChange1w: number,
    websiteUrl: string,
    twitterUrl: string,
    exp: string[],
}

export interface CoinStatsApi {
  data: {
    coins: CoinStatsCoin[];
  }
}

export class CryptoCoinStats extends MarketApi<CoinStatsApi> {
  private responseCoinBase: CoinStatsApi;

  public async getResponse(): Promise<CoinStatsApi> {
    this.responseCoinBase = await axios.get(
      "https://api.coinstats.app/public/v1/coins"
    );
    return this.responseCoinBase;
  }
}
