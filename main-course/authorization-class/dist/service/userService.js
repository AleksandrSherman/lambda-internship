import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;
export class UserService {
    constructor(userDatabase) {
        this.userDatabase = userDatabase;
    }
    async getUserById(id) {
        const foundUserById = await this.userDatabase.getUserById(id);
        const mappedDbUserToUser = this.mapToUser(foundUserById);
        return mappedDbUserToUser;
    }
    mapToUser(user) {
        if (typeof user === 'undefined') {
            return undefined;
        }
        const iUser = {
            _id: user._id?.toString(),
            email: user.email,
            password: user.password,
        };
        return iUser;
    }
    async userMiddleWare(headers) {
        const authorizationHeaders = headers;
        if (typeof authorizationHeaders === "undefined") {
            throw Error("Unauthorized");
        }
        if (authorizationHeaders.split(" ")[0] !== "Bearer") {
            throw Error("Unauthorized");
        }
        const token = authorizationHeaders.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, SECRET_KEY);
        }
        catch (err) {
            throw Error("Token is not valid");
        }
        if (decodedToken.type !== "access") {
            throw Error("Unauthorized");
        }
        const user = await this.getUserById(decodedToken._id);
        if (typeof user === 'undefined') {
            throw Error("User was not found");
        }
        return user;
    }
}
//# sourceMappingURL=userService.js.map