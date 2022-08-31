import { Controller } from "./base.js";
export class CryptoCurrencyController extends Controller {
    constructor(cryptoService) {
        super("/currency");
        this.cryptoService = cryptoService;
        this.getCurrencyInfo = async (req, res) => {
            const currencyName = req.params.currencySymbol;
            try {
                const response = await this.cryptoService.getInfoByCurrency(currencyName);
                const mappedResponse = this.mapToApiCurrency(response);
                res.status(200).json(mappedResponse);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/:currencySymbol", this.getCurrencyInfo);
    }
    mapToApiCurrency(response) {
        const mappedResponse = response.map((row) => {
            const mappedRow = {
                currency: row.currencyName,
                price: row.price,
                site: row.site
            };
            return mappedRow;
        });
        return mappedResponse;
    }
}
//# sourceMappingURL=cryptoCurrencyController.js.map