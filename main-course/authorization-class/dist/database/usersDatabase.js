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
        const MappedToDbfoundUserByEmail = this.mapToDbUser(foundUserByEmail);
        return MappedToDbfoundUserByEmail;
    }
    async getUserById(id) {
        const foundUserById = await this.collection.findOne(new ObjectId(id));
        const MappedToDbfoundUserById = this.mapToDbUser(foundUserById);
        return MappedToDbfoundUserById;
    }
    mapToDbUser(user) {
        if (user === null) {
            return undefined;
        }
        const dbUser = {
            _id: new ObjectId(user._id?.toString()),
            email: user["email"],
            password: user["password"],
        };
        return dbUser;
    }
}
//# sourceMappingURL=usersDatabase.js.map