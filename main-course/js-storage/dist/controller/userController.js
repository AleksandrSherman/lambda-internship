import { Controller } from "./base";
export class UserConstroller extends Controller {
    constructor(userService) {
        super('/s');
        this.userService = userService;
        this.getUserData = (req, res) => {
            const data = req.body.data;
            return res.status(200).json(data);
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/s', this.getUserData);
        this.router.get('', this.giveUserData);
    }
    giveUserData() {
    }
}
//# sourceMappingURL=userController.js.map