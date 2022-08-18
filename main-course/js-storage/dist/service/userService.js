export class UserService {
    constructor(usersDatabase) {
        this.usersDatabase = usersDatabase;
    }
    async postDataToDb(data, path) {
        const user = await this.usersDatabase.checkIfUsersPathExist(path);
        if (typeof user !== "undefined") {
            this.usersDatabase.changeExistUserData(user, data);
        }
        else {
            this.usersDatabase.createUserData(data, path);
        }
    }
    async getDataFromDb(path) {
        const user = await this.usersDatabase.checkIfUsersPathExist(path);
        if (typeof user === "undefined") {
            throw Error("Nothing was found! Try again...");
        }
        else {
            return user.data;
        }
    }
}
//# sourceMappingURL=userService.js.map