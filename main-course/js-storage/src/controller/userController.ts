import { UserService } from "service/userService";
import { Controller } from "./base";

export class UserConstroller extends Controller{
    constructor(private userService: UserService){
        super('/s');

        this.initializeRoutes()
    }

    private initializeRoutes(){
        this.router.post('/s', this.getUserData)
        this.router.get('', this.giveUserData)
    }

    public getUserData = (req, res) => {
        const data = req.body.data
        return res.status(200).json(data);
    }

    public giveUserData(){

    }

}