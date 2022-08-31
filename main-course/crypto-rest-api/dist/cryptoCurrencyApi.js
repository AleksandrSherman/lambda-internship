import axios from "axios";
export class CryptoCurrencyApi {
    constructor() {
        this.currencies = [];
    }
    async getAllResponses() {
        this.responseCoinMarket = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", {
            headers: {
                "X-CMC_PRO_API_KEY": "a608e38c-a9c4-46f7-9afe-9efb5949c6ed",
            },
        });
        this.responseCoinBase = await axios.get("https://api.coinbase.com/v2/exchange-rates");
        this.responseCoinStats = await axios.get("https://api.coinstats.app/public/v1/coins");
    }
    mapResponses() {
        this.responseCoinMarket.data.data.forEach((el) => {
            const currency = {
                site: "CoinMarket",
                symbol: el.symbol,
                priceUsd: el.quote.USD.price,
            };
            this.currencies.push(currency);
        });
        const coinBaseObject = this.responseCoinBase.data.data.rates;
        for (const key in coinBaseObject) {
            const currency = {
                site: "CoinBase",
                symbol: key,
                priceUsd: 1 / coinBaseObject[key],
            };
            this.currencies.push(currency);
        }
        this.responseCoinStats.data.coins.forEach((el) => {
            const currency = {
                site: "CoinStats",
                symbol: el.symbol,
                priceUsd: el.price,
            };
            this.currencies.push(currency);
        });
        return this.currencies;
    }
}
//# sourceMappingURL=cryptoCurrencyApi.js.map