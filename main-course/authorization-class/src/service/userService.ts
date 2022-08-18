import { UsersDatabase } from "database/usersDatabase.js";
import { IUser } from "./authService.js";
import { IDbUser } from "database/usersDatabase.js";
import { IApiUser } from "controller/authController.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export class UserService{
    constructor(private userDatabase: UsersDatabase){}

    public async getUserById(id: string){
        const foundUserById = await this.userDatabase.getUserById(id);
        const mappedDbUserToUser = this.mapToUser(foundUserById as IDbUser);

        return mappedDbUserToUser;
    }

    private mapToUser(user: IDbUser | IApiUser): IUser | undefined{
        if(typeof user === 'undefined'){
            return undefined
        }
    
        const iUser: IUser = {
            _id: user._id?.toString(),
            email: user.email,
            password: user.password,
        }
    
        return iUser;
      }

      public async userMiddleWare(headers): Promise<IUser> {
        const authorizationHeaders: string = headers;
    
        if (typeof authorizationHeaders === "undefined") {
          throw Error("Unauthorized");
        }
    
        if (authorizationHeaders.split(" ")[0] !== "Bearer") {
          throw Error("Unauthorized");
        }
    
        const token: string = authorizationHeaders.split(" ")[1];
        let decodedToken: string | jwt.JwtPayload;
        try {
          decodedToken = jwt.verify(token, SECRET_KEY as string );
        } catch (err) {
          throw Error("Token is not valid");
        }
    
        if((decodedToken as jwt.JwtPayload).type !== "access"){
            throw Error("Unauthorized");
        }
    
        const user = await this.getUserById( (decodedToken as jwt.JwtPayload)._id );
    
        if(typeof user === 'undefined'){
            throw Error("User was not found");
        }
    
        return user;
    }
}