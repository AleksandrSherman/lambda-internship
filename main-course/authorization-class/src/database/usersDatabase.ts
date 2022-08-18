import { Db, Collection, ObjectId } from "mongodb";
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
      this.mapToDbUser(user)
    );
    return insertedModel.insertedId.toString();
  }

  public async getUserByEmail(email: string): Promise<IUser | undefined> {
    const foundUserByEmail = await this.collection.findOne<IDbUser>({ email });
    const mappedToDbfoundUserByEmail = this.mapToUser(foundUserByEmail);

    return mappedToDbfoundUserByEmail;
  }

  public async getUserById(id: string): Promise<IUser | undefined> {
    const foundUserById = await this.collection.findOne<IDbUser>(
      new ObjectId(id)
    );
    const mappedToDbfoundUserById = this.mapToUser(foundUserById);

    return mappedToDbfoundUserById;
  }

  private mapToDbUser(user: IUser): IDbUser {
    const dbUser: IDbUser = {
      _id: new ObjectId(user._id?.toString()),
      email: user.email,
      password: user.password,
    };

    return dbUser;
  }

  private mapToUser(dbUser: IDbUser | null): IUser | undefined {
    if (dbUser === null) {
      return undefined;
    }

    const user: IUser = {
      _id: dbUser._id?.toString(),
      email: dbUser.email,
      password: dbUser.password,
    };

    return user;
  }
}
