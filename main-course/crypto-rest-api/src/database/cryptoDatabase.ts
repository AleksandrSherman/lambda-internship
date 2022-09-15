import { CryptoCurrencyApi, CurrencyInfo } from "Api/cryptoCurrencyApi.js";
import {
  AllLastCurrencies,
  InfoByCurrencyNameAndInterval,
  InfoByCurrencyNameAndSite,
  InfoCurrenciesByName,
} from "Interfaces/interfaces";
import { OkPacket } from "mysql";
import { Connection, RowDataPacket } from "mysql2/promise";
import cron from "node-cron";

export class CryptoDatabase {
  constructor(
    private db: Connection,
    private cryptoCurrencyApi: CryptoCurrencyApi
  ) {}

  public async initializeTables() {
    await this.db
      .execute(`CREATE TABLE IF NOT EXISTS currencies (id INT PRIMARY KEY AUTO_INCREMENT, 
            currency_name VARCHAR(255),
            price FLOAT(255, 3),
            site VARCHAR(255),
            date TIMESTAMP
            );`);
  }

  public async putGeneralDataInDb(responses: CurrencyInfo[]) {
    const values: string[] = [];
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    for (const response of responses) {
      values.push(
        `("${response.symbol}", ${response.priceUsd}, "${response.site}", "${currentDate}")`
      );
    }

    await this.db
      .execute(`INSERT INTO currencies (currency_name, price, site, date)
        VALUES ${values.join(",")};`);
  }

  public async getLastCurrenciesDate(): Promise<string> {
    const [arrayOfLastDate] = await this.db.execute(
      `SELECT date FROM currencies ORDER BY date DESC LIMIT 1;`
    );

    const lastDate: string = arrayOfLastDate![0].date
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    return lastDate;
  }

  public async getAllLastDateCurrencies(
    lastCurrenciesDate: string
  ): Promise<AllLastCurrencies[]> {
    const [allLastCurrencies] = await this.db.execute(
      `SELECT currency_name, price FROM currencies WHERE date = CONVERT_TZ (?, "+00:00","+03:00");`,
      [lastCurrenciesDate]
    );

    const mappedLastCurrencies: AllLastCurrencies[] =
      this.mapToAllLastCurrencies(
        allLastCurrencies as RowDataPacket[] | OkPacket[]
      );

    return mappedLastCurrencies;
  }

  public async getInfoByCurrencyName(
    lastCurrenciesDate: string,
    currencyName: string
  ): Promise<InfoCurrenciesByName[]> {
    const [currenciesByName] = await this.db.execute(
      `SELECT currency_name, price FROM currencies WHERE date = CONVERT_TZ (?, "+00:00","+03:00") AND currency_name=?;`,
      [lastCurrenciesDate, currencyName]
    );
    if (!Object.keys(currenciesByName).length) {
      throw Error("Currency doesn't exist");
    }
    const mappedLastCurrencies: InfoCurrenciesByName[] =
      this.mapToLastDateCurrencies(
        currenciesByName as RowDataPacket[] | OkPacket[]
      );

    return mappedLastCurrencies;
  }

  public async getInfoByCurrencyNameAndSite(
    lastCurrenciesDate: string,
    currencyName: string,
    siteName: string
  ): Promise<InfoByCurrencyNameAndSite[]> {
    const [currenciesByNameAndSite] = await this.db.execute(
      `SELECT currency_name, price, site FROM currencies 
                WHERE date = CONVERT_TZ (?, "+00:00","+03:00") 
                AND currency_name=?
                AND site = ?;`,
      [lastCurrenciesDate, currencyName, siteName]
    );
    if (!Object.keys(currenciesByNameAndSite).length) {
      throw Error("Site or currency doesn't exist");
    }
    const mappedLastCurrencies: InfoByCurrencyNameAndSite[] =
      this.mapToCurrencyNameAndSite(
        currenciesByNameAndSite as RowDataPacket[] | OkPacket[]
      );
    return mappedLastCurrencies;
  }

  public async getInfoByCurrencyNameAndInterval(
    currencyName: string,
    timeInterval: number
  ): Promise<InfoByCurrencyNameAndInterval[]> {
    const currentDate: Date = new Date();
    const intervalDate = new Date(
      currentDate.setMinutes(currentDate.getMinutes() - timeInterval)
    );

    const intervalDateToDbFormat = intervalDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const [currenciesByNameAndInterval] = await this.db.execute(
      `SELECT currency_name, price, date FROM currencies 
              WHERE date >= ?
              AND currency_name=?;`,
      [intervalDateToDbFormat, currencyName]
    );

    if (!Object.keys(currenciesByNameAndInterval).length) {
      throw Error("Site or currency doesn't exist");
    }

    const mappedLastCurrencies: InfoByCurrencyNameAndInterval[] =
      this.mapToCurrencyNameAndInterval(
        currenciesByNameAndInterval as RowDataPacket[] | OkPacket[]
      );

    return mappedLastCurrencies;
  }

  public async makeIntervalRequests(): Promise<void> {
    cron.schedule("*/5 * * * *", async () => {
      await this.cryptoCurrencyApi.getResponses();
      const responses: CurrencyInfo[] =
        await this.cryptoCurrencyApi.mapResponses();

      await this.putGeneralDataInDb(responses);
    });
  }

  private mapToAllLastCurrencies(
    allLastCurrencies: RowDataPacket[] | OkPacket[]
  ): AllLastCurrencies[] {
    const result: AllLastCurrencies[] = [];
    allLastCurrencies.map((element) => {
      const mappedObject: AllLastCurrencies = {
        currencyName: element.currency_name,
        price: element.price,
      };
      result.push(mappedObject);
    });
    return result;
  }

  private mapToLastDateCurrencies(
    currenciesByName: RowDataPacket[] | OkPacket[]
  ): InfoCurrenciesByName[] {
    const result: InfoCurrenciesByName[] = [];
    currenciesByName.map((element) => {
      const mappedObject: InfoCurrenciesByName = {
        currencyName: element.currency_name,
        price: element.price,
      };
      result.push(mappedObject);
    });
    return result;
  }

  private mapToCurrencyNameAndSite(
    currenciesByNameAndSite: RowDataPacket[] | OkPacket[]
  ): InfoByCurrencyNameAndSite[] {
    const result: InfoByCurrencyNameAndSite[] = [];

    currenciesByNameAndSite.map((element) => {
      const mappedObject: InfoByCurrencyNameAndSite = {
        currencyName: element.currency_name,
        price: element.price,
        site: element.site,
      };
      result.push(mappedObject);
    });
    return result;
  }

  private mapToCurrencyNameAndInterval(
    currenciesByNameAndInterval: RowDataPacket[] | OkPacket[]
  ): InfoByCurrencyNameAndInterval[] {
    const result: InfoByCurrencyNameAndInterval[] = [];

    currenciesByNameAndInterval.map((element) => {
      const mappedObject: InfoByCurrencyNameAndInterval = {
        currencyName: element.currency_name,
        price: element.price,
        date: element.date,
      };
      result.push(mappedObject);
    });
    return result;
  }
}
