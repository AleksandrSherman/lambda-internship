import { CryptoCurrencyApi, CurrencyInfo } from "cryptoCurrencyApi";
import { Connection, OkPacket, RowDataPacket } from "mysql2/promise";
import cron from "node-cron";

export interface DbCurrency {
  currencyName: string;
  price: number;
  site: string;
}

export interface DbSite{
    currencyName: string;
    price: number;
}

export class CryptoDatabase {
  constructor( private db: Connection, private cryptoCurrencyApi: CryptoCurrencyApi ) { this.makeIntervalRequests(); }

  public async initializeTables() {
    await this.db
      .execute(`CREATE TABLE IF NOT EXISTS currencies (id INT PRIMARY KEY, 
            currency_name VARCHAR(255),
            price FLOAT(255, 10),
            site VARCHAR(255)
            );`);
  }

  public async putGeneralDataInDb(responses) {
    let index = 1;
    while (index <= responses.length) {
      for await (const response of responses) {
        await this.db
          .execute(`INSERT INTO currencies (id, currency_name, price, site)
        VALUES (${index},"${response.symbol}", "${response.priceUsd}", "${response.site}")
        ON DUPLICATE KEY UPDATE currency_name = "${response.symbol}", price = "${response.priceUsd}", site = "${response.site}"`);
        index++;
      }
    }
    await this.db.execute(`ALTER TABLE currencies AUTO_INCREMENT = ${index}`);
  }

  public async getInfoByCurrency(name: string) {
    const [response] = await this.db.execute(
      `SELECT currency_name, price, site FROM currencies WHERE currency_name = "${name}"`
    );

    const mappedToDbCurrency = this.mapToDbCurrency(response as RowDataPacket[][]  | RowDataPacket[] | OkPacket[])

    return mappedToDbCurrency;
  }

  public async getInfoBySite(siteName: string){
    const [response] = await this.db.execute(`SELECT currency_name, price FROM currencies WHERE site = "${siteName}"`);

    const mappedToDbCurrency = this.mapToDbSite(response as RowDataPacket[][]  | RowDataPacket[] | OkPacket[])

    return mappedToDbCurrency;
}

  private async changeGeneralDataInDb(responses: CurrencyInfo[]) {
    for await (const response of responses) {
      const [rows] = await this.db.execute(
        `SELECT * FROM currencies WHERE currency_name = "${response.symbol}"`
      );

      if (!rows) {
        await this.db
          .execute(`INSERT INTO currencies (currency_name, price, site)
        VALUES ("${response.symbol}", "${response.priceUsd}", "${response.site}")
        ON DUPLICATE KEY UPDATE currency_name = "${response.symbol}", price = "${response.priceUsd}", site = "${response.site}"`);
      } else {
        await this.db.execute(
          `UPDATE currencies SET price = ${response.priceUsd} WHERE currency_name = "${response.symbol}" AND site = "${response.site}"`
        );
      }
    }
  }

  private async makeIntervalRequests() {
    await this.cryptoCurrencyApi.getAllResponses();
    const responses: CurrencyInfo[] = this.cryptoCurrencyApi.mapResponses();

    await this.initializeTables();
    await this.putGeneralDataInDb(responses);

    cron.schedule("*/5 * * * * *", async () => {
      await this.cryptoCurrencyApi.getAllResponses();
      const responses: CurrencyInfo[] = this.cryptoCurrencyApi.mapResponses();

      await this.changeGeneralDataInDb(responses);

    });
  }

  private mapToDbCurrency(response: RowDataPacket[][]  | RowDataPacket[] | OkPacket[]): DbCurrency[] {

    const result: DbCurrency[]  = response.map((row) => {
        const mappedResponse: DbCurrency = {
            currencyName: row.currency_name,
            price: row.price,
            site: row.site
        }
        return mappedResponse;
       });
       return result;
    }

   private mapToDbSite(response: RowDataPacket[][]  | RowDataPacket[] | OkPacket[]): DbSite[] {

        const result: DbSite[]  = response.map((row) => {
            const mappedResponse: DbSite = {
                currencyName: row.currency_name,
                price: row.price,
            }
            return mappedResponse;
           });
           return result;
        }
  }
