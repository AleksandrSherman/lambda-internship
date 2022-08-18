import "dotenv/config";

import { UsersDatabase } from "database/usersDatabase.js";
import jwt from "jsonwebtoken";
import { IDbUser } from "database/usersDatabase.js";
import { IApiUser } from "controller/authController.js";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.SECRET_KEY;

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
}

interface IDecodedToken {
  type?: string;
  _id?: string;
}

export class AuthService {
  constructor(private userDatabase: UsersDatabase) {}

  public async createUser(user: IApiUser): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);

    user.password = hash;

    return await this.userDatabase.create(user);
  }

  public async getUserByEmail(email: string): Promise<IUser | undefined> {
    const foundUserByEmail = await this.userDatabase.getUserByEmail(email);
    return foundUserByEmail;
  }

  public generateJwtTokens(id: string) {
    const accessToken = jwt.sign(
      { _id: id, type: "access" },
      SECRET_KEY as string,
      {
        expiresIn: this.randomTokenTime(60, 30),
      }
    );
    const refreshToken = jwt.sign(
      { _id: id, type: "refresh" },
      SECRET_KEY as string,
      {
        expiresIn: "30d",
      }
    );
    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  public checkPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  public randomTokenTime(max: number, min: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public checkIfValidToken(refreshToken: string): jwt.JwtPayload {
    let decodedToken: string | jwt.JwtPayload;
    try {
      decodedToken = jwt.verify(refreshToken, SECRET_KEY as string);
    } catch (err) {
      throw Error("Token is not valid");
    }

    if ((decodedToken as IDecodedToken).type !== "refresh") {
      throw Error("Token is not valid");
    }

    return decodedToken as jwt.JwtPayload;
  }

}
