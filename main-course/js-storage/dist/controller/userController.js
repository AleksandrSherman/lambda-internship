import { Controller } from "./base.js";
export class UserConstroller extends Controller {
    constructor(userService) {
        super("/");
        this.userService = userService;
        this.getUserData = (req, res) => {
            const data = req.body;
            const pathParam = req.params.userRoute;
            try {
                this.userService.postDataToDb(data, pathParam);
                res.status(200).json({ status: "Success" });
            }
            catch (err) {
                res.status(400).json({ status: "Something went wrong" });
            }
        };
        this.giveUserData = async (req, res) => {
            const path = req.params.userRoute;
            try {
                const userData = await this.userService.getDataFromDb(path);
                console.log(userData);
                res.status(200).json(userData);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post("/:userRoute", this.getUserData);
        this.router.get("/:userRoute", this.giveUserData);
    }
}
//# sourceMappingURL=userController.js.map