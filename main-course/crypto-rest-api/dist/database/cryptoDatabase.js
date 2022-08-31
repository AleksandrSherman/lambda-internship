import cron from "node-cron";
export class CryptoDatabase {
    constructor(db, cryptoCurrencyApi) {
        this.db = db;
        this.cryptoCurrencyApi = cryptoCurrencyApi;
        this.makeIntervalRequests();
    }
    async initializeTables() {
        await this.db
            .execute(`CREATE TABLE IF NOT EXISTS currencies (id INT PRIMARY KEY, 
            currency_name VARCHAR(255),
            price FLOAT(255, 10),
            site VARCHAR(255)
            );`);
    }
    async putGeneralDataInDb(responses) {
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
    async getInfoByCurrency(name) {
        const [response] = await this.db.execute(`SELECT currency_name, price, site FROM currencies WHERE currency_name = "${name}"`);
        const mappedToDbCurrency = this.mapToDbCurrency(response);
        return mappedToDbCurrency;
    }
    async getInfoBySite(siteName) {
        const [response] = await this.db.execute(`SELECT currency_name, price FROM currencies WHERE site = "${siteName}"`);
        const mappedToDbCurrency = this.mapToDbSite(response);
        return mappedToDbCurrency;
    }
    async changeGeneralDataInDb(responses) {
        for await (const response of responses) {
            const [rows] = await this.db.execute(`SELECT * FROM currencies WHERE currency_name = "${response.symbol}"`);
            if (!rows) {
                await this.db
                    .execute(`INSERT INTO currencies (currency_name, price, site)
        VALUES ("${response.symbol}", "${response.priceUsd}", "${response.site}")
        ON DUPLICATE KEY UPDATE currency_name = "${response.symbol}", price = "${response.priceUsd}", site = "${response.site}"`);
            }
            else {
                await this.db.execute(`UPDATE currencies SET price = ${response.priceUsd} WHERE currency_name = "${response.symbol}" AND site = "${response.site}"`);
            }
        }
    }
    async makeIntervalRequests() {
        await this.cryptoCurrencyApi.getAllResponses();
        const responses = this.cryptoCurrencyApi.mapResponses();
        await this.initializeTables();
        await this.putGeneralDataInDb(responses);
        cron.schedule("*/5 * * * * *", async () => {
            await this.cryptoCurrencyApi.getAllResponses();
            const responses = this.cryptoCurrencyApi.mapResponses();
            await this.changeGeneralDataInDb(responses);
            console.log("updated");
        });
    }
    mapToDbCurrency(response) {
        const result = response.map((row) => {
            const mappedResponse = {
                currencyName: row.currency_name,
                price: row.price,
                site: row.site
            };
            return mappedResponse;
        });
        return result;
    }
    mapToDbSite(response) {
        const result = response.map((row) => {
            const mappedResponse = {
                currencyName: row.currency_name,
                price: row.price,
            };
            return mappedResponse;
        });
        return result;
    }
}
//# sourceMappingURL=cryptoDatabase.js.map