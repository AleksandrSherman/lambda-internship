import { CryptoDatabase, DbCurrency, DbSite } from "database/cryptoDatabase.js";

export interface Currency {
  currencyName: string;
  price: number;
  site: string;
}

export interface Site{
    currencyName: string;
    price: number;
}


export class CryptoService {
  constructor(private cryptoDatabase: CryptoDatabase) {}

  public async getInfoByCurrency(name: string) {
    const responseFromDb: DbCurrency[] = await this.cryptoDatabase.getInfoByCurrency(name);

    if (!responseFromDb.length){
        throw Error("Currency doesn't exist...");
    }

      const mappedResponse: Currency[] = this.mapToCurrency(responseFromDb);
      return mappedResponse;
    }

    public async getInfoBySite(siteName: string){
        const response = await this.cryptoDatabase.getInfoBySite(siteName);

        if (!response.length){
            throw Error("Site doesn't exist...");
        }
    
          const mappedResponse: Site[] = this.mapToSite(response);
          return mappedResponse;
    }

  private mapToCurrency(response: DbCurrency[]): Currency[] {
    const mappedResponse = response.map((row)=>{
        const mappedRow: Currency = {  currencyName: row.currencyName,
            price: row.price,
            site: row.site
        }
        return mappedRow;
    })

    return mappedResponse;
  }

  private mapToSite(response: DbSite[]): Site[] {
    const mappedResponse = response.map((row)=>{
        const mappedRow: Site = {  
            currencyName: row.currencyName,
            price: row.price,
        }
        return mappedRow;
    })

    return mappedResponse;
  }
}
