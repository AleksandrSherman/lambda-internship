import { CryptoService } from "service/cryptoService.js";
import { Controller } from "./base.js";

export interface ApiCurrency {
  currency: string;
  price: number;
  site: string;
}

interface QueryParams {
  [key: string]: string;
}

export class CryptoCurrencyController extends Controller {
  constructor(private cryptoService: CryptoService) {
    super("/currencies");
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/:currencySymbol?/:site?",
      this.getCurrencyInfo
    );
  }

  private getCurrencyInfo = async (req, res) => {
    const currencyName: string | undefined = req.params.currencySymbol;
    const siteName: string | undefined = req.params.site;
    const queryParams: QueryParams = req.query;

    try {
      const currensiesOutputLimit = +queryParams.limit;
      if(currensiesOutputLimit < 1){
        throw Error("Limit must be more than 0")
      }
      const currensiesOutputInterval = +queryParams.interval;

      const response = await this.cryptoService.getInfoAboutCurrency(currencyName, siteName, currensiesOutputInterval, currensiesOutputLimit);
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}
