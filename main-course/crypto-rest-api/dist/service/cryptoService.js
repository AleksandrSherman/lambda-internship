export class CryptoService {
    constructor(cryptoDatabase) {
        this.cryptoDatabase = cryptoDatabase;
    }
    async getInfoByCurrency(name) {
        const responseFromDb = await this.cryptoDatabase.getInfoByCurrency(name);
        if (!responseFromDb.length) {
            throw Error("Currency doesn't exist...");
        }
        const mappedResponse = this.mapToCurrency(responseFromDb);
        return mappedResponse;
    }
    async getInfoBySite(siteName) {
        const response = await this.cryptoDatabase.getInfoBySite(siteName);
        if (!response.length) {
            throw Error("Site doesn't exist...");
        }
        const mappedResponse = this.mapToSite(response);
        return mappedResponse;
    }
    mapToCurrency(response) {
        const mappedResponse = response.map((row) => {
            const mappedRow = { currencyName: row.currencyName,
                price: row.price,
                site: row.site
            };
            return mappedRow;
        });
        return mappedResponse;
    }
    mapToSite(response) {
        const mappedResponse = response.map((row) => {
            const mappedRow = {
                currencyName: row.currencyName,
                price: row.price,
            };
            return mappedRow;
        });
        return mappedResponse;
    }
}
//# sourceMappingURL=cryptoService.js.map