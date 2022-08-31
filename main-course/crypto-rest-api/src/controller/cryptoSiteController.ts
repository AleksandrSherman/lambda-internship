import { CryptoService, Site } from "service/cryptoService.js";
import { Controller } from "./base.js";

export interface ApiCurrency {
  currency: string;
  price: number;
  site: string;
}

export interface ApiSite{
    [key: string]: Site
}

export class CryptoSiteController extends Controller {
  constructor(private cryptoService: CryptoService) {
    super("/site");
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/:siteName", this.getSiteInfo);
  }

  private getSiteInfo = async (req, res) => {
    const siteName: string = req.params.siteName;

    try{
    const response = await this.cryptoService.getInfoBySite(siteName);
    const mappedResponse = this.mapToApiSite(response, siteName);

    res.status(200).json( mappedResponse );
    }
    catch(err){
      res.status(400).json( {error: err.message} );
    }
  };

  private mapToApiSite(response: Site[], siteName: string): ApiSite[]{

    const mappedResponse: ApiSite[] = response.map((row) => {
      const mappedRow = {
        [siteName]: {
            currencyName: row.currencyName,
            price: row.price,
        }
      }
      return mappedRow;
    });
    return mappedResponse;
  }
}
