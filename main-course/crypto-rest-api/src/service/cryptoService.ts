import { CryptoDatabase } from "database/cryptoDatabase.js";
import {
  AllLastCurrencies,
  AverageCurrency,
  InfoByCurrencyNameAndInterval,
  InfoCurrenciesByName,
  PreAverageCurrency,
} from "Interfaces/interfaces";

export class CryptoService {
  constructor(private cryptoDatabase: CryptoDatabase) {}

  public async getInfoAboutCurrency(
    currencyName: string | undefined,
    siteName: string | undefined,
    timeInterval: number | undefined,
    currensiesOutputLimit: number | undefined
  ) {
    const lastCurrenciesDate: string =
      await this.cryptoDatabase.getLastCurrenciesDate();

    if (
      (currencyName && siteName && timeInterval) ||
      (!currencyName && !siteName && timeInterval)
    ) {
      throw Error("Unsupported query param in this case");
    }

    if (!currencyName && !siteName && !timeInterval) {
      const infoAllCurrencies =
        await this.cryptoDatabase.getAllLastDateCurrencies(lastCurrenciesDate);
      const infoAllCurrenciesWithAvgPrices = this.getAveragePrices(
        infoAllCurrencies,
        timeInterval
      );

      if (currensiesOutputLimit) {
        const entries = Object.entries(infoAllCurrenciesWithAvgPrices);
        const splittedEntries = entries.slice(0, currensiesOutputLimit);

        const mappedToObject = Object.fromEntries(splittedEntries);

        return mappedToObject;
      }

      return infoAllCurrenciesWithAvgPrices;
    }
    if (currencyName && !siteName && !timeInterval) {
      const infoByCurrencyName =
        await this.cryptoDatabase.getInfoByCurrencyName(
          lastCurrenciesDate,
          currencyName
        );
      const infoByCurrencyNameWithAvgPrices = this.getAveragePrices(
        infoByCurrencyName,
        timeInterval
      );

      if (currensiesOutputLimit) {
        const entries = Object.entries(infoByCurrencyNameWithAvgPrices);
        const splittedEntries = entries.slice(0, currensiesOutputLimit);

        const mappedToObject = Object.fromEntries(splittedEntries);

        return mappedToObject;
      }

      return infoByCurrencyNameWithAvgPrices;
    }
    if (currencyName && siteName && !timeInterval) {
      const infoByCurrencyNameAndSite =
        await this.cryptoDatabase.getInfoByCurrencyNameAndSite(
          lastCurrenciesDate,
          currencyName,
          siteName
        );

      return infoByCurrencyNameAndSite;
    }
    if (currencyName && !siteName && timeInterval) {
      const infoByCurrencyNameAndInterval =
        await this.cryptoDatabase.getInfoByCurrencyNameAndInterval(
          currencyName,
          timeInterval
        );
      const infoByCurrencyNameAndIntervalWithAvgPrices = this.getAveragePrices(
        infoByCurrencyNameAndInterval,
        timeInterval
      );

      if (currensiesOutputLimit) {
        const entries = Object.entries(
          infoByCurrencyNameAndIntervalWithAvgPrices
        );
        const splittedEntries = entries.slice(0, currensiesOutputLimit);

        const mappedToObject = Object.fromEntries(splittedEntries);

        return mappedToObject;
      }

      return infoByCurrencyNameAndIntervalWithAvgPrices;
    }
  }

  private getAveragePrices(
    currencyArray:
      | AllLastCurrencies[]
      | InfoCurrenciesByName[]
      | InfoByCurrencyNameAndInterval[],
    timeInterval: number | undefined
  ): AverageCurrency {

    const averageCurrencies: AverageCurrency = {};
    const preAverageCurrency: PreAverageCurrency = {};

    let pricesSum: number;
    let averagePrice: number;

    if(!timeInterval){
      currencyArray.forEach((element) => {
        if (preAverageCurrency[element.currencyName]) {
          preAverageCurrency[element.currencyName] = [
            ...(preAverageCurrency[element.currencyName]),
            element.price,
          ];
        } else {
          preAverageCurrency[element.currencyName] = [element.price];
        }
      });
    }else{
      (currencyArray as InfoByCurrencyNameAndInterval[]).forEach((element) => {
        const date: number = element.date.getTime();

        if (preAverageCurrency[date]) {
          preAverageCurrency[date] = [
            ...(preAverageCurrency[date]),
            element.price,
          ];
        } else {
          preAverageCurrency[date] = [element.price];
        }
      });
    }

    for (const key in preAverageCurrency) {
      pricesSum = 0;
      (preAverageCurrency[key]).forEach((price) => {
        pricesSum += price;
      });
      averagePrice = pricesSum / (preAverageCurrency[key]).length;
      averageCurrencies[key] = averagePrice;
    }
    return averageCurrencies;
  }
}
