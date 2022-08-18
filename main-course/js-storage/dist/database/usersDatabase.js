import { ObjectId } from "mongodb";
export class UsersDatabase {
    constructor(db) {
        this.db = db;
        this.collection = db.collection("usersRouts");
    }
    async checkIfUsersPathExist(pathParam) {
        const foundUser = await this.collection.findOne({ path: pathParam });
        const mappedToUser = this.mapToUser(foundUser);
        return mappedToUser;
    }
    async changeExistUserData(user, userNewdata) {
        const dbUser = this.mapToDbUser(user);
        const newData = { $set: { data: userNewdata } };
        await this.collection.updateOne(dbUser, newData);
    }
    async createUserData(data, path) {
        await this.collection.insertOne({ path: path, data: data });
    }
    mapToUser(dbUser) {
        if (dbUser === null) {
            return undefined;
        }
        const user = {
            _id: dbUser._id.toString(),
            path: dbUser.path,
            data: dbUser.data
        };
        return user;
    }
    mapToDbUser(user) {
        const dbUser = {
            _id: new ObjectId(user._id),
            path: user.path,
            data: user.data
        };
        return dbUser;
    }
}
//# sourceMappingURL=usersDatabase.js.map