import { Controller } from "./base.js";
export class CryptoSiteController extends Controller {
    constructor(cryptoService) {
        super("/site");
        this.cryptoService = cryptoService;
        this.getSiteInfo = async (req, res) => {
            const siteName = req.params.siteName;
            try {
                const response = await this.cryptoService.getInfoBySite(siteName);
                const mappedResponse = this.mapToApiSite(response, siteName);
                res.status(200).json(mappedResponse);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/:siteName", this.getSiteInfo);
    }
    mapToApiSite(response, siteName) {
        const mappedResponse = response.map((row) => {
            const mappedRow = {
                [siteName]: {
                    currencyName: row.currencyName,
                    price: row.price,
                }
            };
            return mappedRow;
        });
        return mappedResponse;
    }
}
//# sourceMappingURL=cryptoSiteController.js.map