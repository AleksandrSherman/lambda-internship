import { Db, Collection, ObjectId } from "mongodb";
import { User } from "service/userService";

interface DbUser {
  _id: ObjectId;
  path: string;
  data: any;
}

export class UsersDatabase {
  private collection: Collection;

  constructor(private db: Db) {
    this.collection =  db.collection("usersRouts");
  }

  public async checkIfUsersPathExist(pathParam: string): Promise<User | undefined> {
    const foundUser = await this.collection.findOne<DbUser>({ path: pathParam });
    const mappedToUser = this.mapToUser(foundUser);

    return mappedToUser;
  }

  public async changeExistUserData(user: User, userNewdata: any): Promise<void> {
    const dbUser = this.mapToDbUser(user);
    const newData = { $set: { data: userNewdata } }
    await this.collection.updateOne(dbUser, newData)
  }

  public async createUserData(data: any, path: string): Promise<void>{
    await this.collection.insertOne({path: path, data: data})
  }

  private mapToUser(dbUser: DbUser | null) : User | undefined{
    if(dbUser === null){
        return undefined
    }
    
    const user = {
      _id: dbUser._id.toString(),
      path: dbUser.path,
      data: dbUser.data
    };
    return user;
  }

  private mapToDbUser(user: User): DbUser{
    const dbUser = {
        _id: new ObjectId(user._id),
        path: user.path,
        data: user.data
    }

    return dbUser;
  }
}
