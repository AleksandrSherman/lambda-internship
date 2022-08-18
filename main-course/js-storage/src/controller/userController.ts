import { UserService } from "service/userService.js";
import { Controller } from "./base.js";

export class UserConstroller extends Controller {
  constructor(private userService: UserService) {
    super("/");

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/:userRoute", this.getUserData);
    this.router.get("/:userRoute", this.giveUserData);
  }

  public getUserData = (req, res) => {
    const data: any = req.body;
    const pathParam: string = req.params.userRoute;

    try {
      this.userService.postDataToDb(data, pathParam);
      res.status(200).json({ status: "Success" });
    } catch (err) {
      res.status(400).json({ status: "Something went wrong" });
    }
  };

  public giveUserData = async (req, res) => {
    const path: string = req.params.userRoute;

    try {
      const userData: any = await this.userService.getDataFromDb(path);
      console.log(userData);

      res.status(200).json( userData );
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}
