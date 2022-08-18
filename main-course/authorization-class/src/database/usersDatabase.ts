import { Db, Collection, ObjectId, WithId } from "mongodb";
import { IUser } from "service/authService.js";

export interface IDbUser {
  _id?: ObjectId;
  email: string;
  password: string;
}

export class UsersDatabase {
  private collection: Collection;

  constructor(database: Db) {
    this.collection = database.collection("users");
  }

  public async create(user: IUser): Promise<string> {
    const insertedModel = await this.collection.insertOne(
      this.mapToDbUser(user) as IDbUser
    );
    return insertedModel.insertedId.toString();
  }

  public async getUserByEmail(email: string): Promise<IDbUser | undefined> {
    const foundUserByEmail = await this.collection.findOne({ email });
    const MappedToDbfoundUserByEmail = this.mapToDbUser(
      foundUserByEmail as WithId<Document>
    );

    return MappedToDbfoundUserByEmail;
  }

  public async getUserById(id: string): Promise<IDbUser | undefined> {

    const foundUserById = await this.collection.findOne( new ObjectId(id));
    const MappedToDbfoundUserById = this.mapToDbUser(
      foundUserById as WithId<Document>
    );

    return MappedToDbfoundUserById;
  }

  private mapToDbUser(user: IUser | WithId<Document>): IDbUser | undefined {
    if(user === null){
        return undefined
    }

    const dbUser: IDbUser = {
      _id: new ObjectId(user._id?.toString()),
      email: user["email"],
      password: user["password"],
    };

    return dbUser;
  }
}
