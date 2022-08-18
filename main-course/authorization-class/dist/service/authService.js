import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const SECRET_KEY = process.env.SECRET_KEY;
export class AuthService {
    constructor(userDatabase) {
        this.userDatabase = userDatabase;
    }
    async createUser(user) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
        return await this.userDatabase.create(this.mapToUser(user));
    }
    async getUserByEmail(email) {
        const foundUserByEmail = await this.userDatabase.getUserByEmail(email);
        const mappedDbUserToUser = this.mapToUser(foundUserByEmail);
        return mappedDbUserToUser;
    }
    generateJwtTokens(id) {
        const accessToken = jwt.sign({ _id: id, type: "access" }, SECRET_KEY, {
            expiresIn: this.randomTokenTime(60, 30),
        });
        const refreshToken = jwt.sign({ _id: id, type: "refresh" }, SECRET_KEY, {
            expiresIn: "30d",
        });
        return { accessToken: accessToken, refreshToken: refreshToken };
    }
    checkPassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
    randomTokenTime(max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    checkIfValidToken(refreshToken) {
        let decodedToken;
        try {
            decodedToken = jwt.verify(refreshToken, SECRET_KEY);
        }
        catch (err) {
            throw Error("Token is not valid");
        }
        if (decodedToken.type !== "refresh") {
            throw Error("Token is not valid");
        }
        return decodedToken;
    }
    mapToUser(user) {
        if (typeof user === "undefined") {
            return undefined;
        }
        const iUser = {
            _id: user._id?.toString(),
            email: user.email,
            password: user.password,
        };
        return iUser;
    }
}
//# sourceMappingURL=authService.js.map