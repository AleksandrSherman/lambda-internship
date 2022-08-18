import { UserService } from "service/userService.js";
import { Controller } from "./base.js";
import { IApiUser } from "./authController.js";
import { IUser } from "service/authService.js";
import { ObjectId } from "mongodb";

export class UserController extends Controller {
  constructor(private userService: UserService) {
    super("/user");

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/getMe[0-9]", this.getMe);
  }

  public getMe = async (req, res) => {

    let mappedUserToApiUser: IApiUser;
    try{
        const user: IUser = await this.userService.userMiddleWare(req.headers.authorization);

        mappedUserToApiUser = this.mapToApiUser(user as IUser);
    }catch(err){
         return res.status(400).json({ error: err.message })
    }
    return res.status(200).json({ request_num: req.url[req.url.length - 1], data: { username: mappedUserToApiUser.email } });
  };

  private mapToApiUser(user: IUser): IApiUser{
    const apiUser: IApiUser = {
        _id: new ObjectId(user._id),
        email: user["email"],
        password: user["password"],
      };

    return apiUser;
  }
}
