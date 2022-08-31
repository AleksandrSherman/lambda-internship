import { CryptoService, Currency } from "service/cryptoService.js";
import { Controller } from "./base.js";

export interface ApiCurrency {
  currency: string;
  price: number;
  site: string;
}

export class CryptoCurrencyController extends Controller {
  constructor(private cryptoService: CryptoService) {
    super("/currency");
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/:currencySymbol", this.getCurrencyInfo);
  }

  private getCurrencyInfo = async (req, res) => {
    const currencyName: string = req.params.currencySymbol;

    try{
    const response = await this.cryptoService.getInfoByCurrency(currencyName);
    const mappedResponse = this.mapToApiCurrency(response);

    res.status(200).json( mappedResponse );
    }
    catch(err){
      res.status(400).json( {error: err.message} );
    }
  };

  private mapToApiCurrency(response: Currency[]): ApiCurrency[]{
    const mappedResponse: ApiCurrency[] = response.map((row) => {
      const mappedRow = {
        currency: row.currencyName,
        price: row.price,
        site: row.site
      }
      return mappedRow;
    });
    return mappedResponse;
  }
}
