import { Controller } from "./base.js";
import { ObjectId } from "mongodb";
export class UserController extends Controller {
    constructor(userService) {
        super("/user");
        this.userService = userService;
        this.getMe = async (req, res) => {
            let mappedUserToApiUser;
            try {
                const user = await this.userService.userMiddleWare(req.headers.authorization);
                mappedUserToApiUser = this.mapToApiUser(user);
            }
            catch (err) {
                return res.status(400).json({ error: err.message });
            }
            return res.status(200).json({ request_num: req.url[req.url.length - 1], data: { username: mappedUserToApiUser.email } });
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/getMe[0-9]", this.getMe);
    }
    mapToApiUser(user) {
        const apiUser = {
            _id: new ObjectId(user._id),
            email: user["email"],
            password: user["password"],
        };
        return apiUser;
    }
}
//# sourceMappingURL=userController.js.map