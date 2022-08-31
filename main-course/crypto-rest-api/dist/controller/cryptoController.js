import { Controller } from "./base.js";
export class CryptoController extends Controller {
    constructor(cryptoService) {
        super("/");
        this.cryptoService = cryptoService;
        this.getInfoAboutCryptoCurrency = async (req, res) => {
            const route = req.params.CurrencySymbol;
            const response = await this.cryptoService.getInfoAboutCryptoCurrency(route);
            const mappedResponse = this.mapToApiCurrency(response);
            res.status(400).json({ data: mappedResponse });
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/:CurrencySymbol", this.getInfoAboutCryptoCurrency);
    }
    mapToApiCurrency(serviceResponse) {
        const resultArray = [];
        serviceResponse.forEach((el) => {
            const result = {
                currency: el.symbol,
                priceInUsd: el.priceUsd,
                site: el.site
            };
            resultArray.push(result);
        });
        return resultArray;
    }
}
//# sourceMappingURL=cryptoController.js.map