import { UsersDatabase } from "database/usersDatabase.js";

export interface User {
    _id?: string,
    path: string,
    data: any
}

export class UserService {
  constructor(private usersDatabase: UsersDatabase) {}

  public async postDataToDb(data: any, path: string): Promise<void> {

    const user = await this.usersDatabase.checkIfUsersPathExist(path);

    if(typeof user !== "undefined"){
         this.usersDatabase.changeExistUserData(user, data);
    }else{
        this.usersDatabase.createUserData(data, path);
    }

  }

  public async getDataFromDb(path: string): Promise<any>{

    const user = await this.usersDatabase.checkIfUsersPathExist(path);

    if(typeof user === "undefined"){
        throw Error("Nothing was found! Try again...")
    }else{
        return user.data;
    }

  }
}
