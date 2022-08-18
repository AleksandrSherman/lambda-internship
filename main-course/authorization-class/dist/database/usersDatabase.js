import { ObjectId } from "mongodb";
export class UsersDatabase {
    constructor(database) {
        this.collection = database.collection("users");
    }
    async create(user) {
        const insertedModel = await this.collection.insertOne(this.mapToDbUser(user));
        return insertedModel.insertedId.toString();
    }
    async getUserByEmail(email) {
        const foundUserByEmail = await this.collection.findOne({ email });
        const mappedToDbfoundUserByEmail = this.mapToUser(foundUserByEmail);
        return mappedToDbfoundUserByEmail;
    }
    async getUserById(id) {
        const foundUserById = await this.collection.findOne(new ObjectId(id));
        const mappedToDbfoundUserById = this.mapToUser(foundUserById);
        return mappedToDbfoundUserById;
    }
    mapToDbUser(user) {
        const dbUser = {
            _id: new ObjectId(user._id?.toString()),
            email: user.email,
            password: user.password,
        };
        return dbUser;
    }
    mapToUser(dbUser) {
        if (dbUser === null) {
            return undefined;
        }
        const user = {
            _id: dbUser._id?.toString(),
            email: dbUser.email,
            password: dbUser.password,
        };
        return user;
    }
}
//# sourceMappingURL=usersDatabase.js.map