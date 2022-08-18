import { Controller } from "./base.js";
export class UserController extends Controller {
    constructor(userService) {
        super("/user");
        this.userService = userService;
        this.getMe = async (req, res) => {
            try {
                const user = await this.userService.userMiddleWare(req.headers.authorization);
                return res.status(200).json({
                    request_num: req.url[req.url.length - 1],
                    data: { username: user.email },
                });
            }
            catch (err) {
                return res.status(400).json({ error: err.message });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/getMe[0-9]", this.getMe);
    }
}
//# sourceMappingURL=userController.js.map