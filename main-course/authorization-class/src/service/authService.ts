import 'dotenv/config';

import { UsersDatabase } from "database/usersDatabase.js";
import jwt from "jsonwebtoken"
import { IDbUser } from 'database/usersDatabase.js';
import { IApiUser } from 'controller/authController.js';

const SECRET_KEY = process.env.SECRET_KEY;

export interface IUser {
    _id?: string ;
    email: string ;
    password: string ;
    accessToken?: string ;
    refreshToken?: string ;
}

interface IDecodedToken{
    type?: string,
    _id?: string
}

export class AuthService {
  constructor(private userDatabase: UsersDatabase) {}

  public async createUser(user: IApiUser): Promise<string> {
    return await this.userDatabase.create(this.mapToUser(user) as IUser); 
  } 

  public async getUserByEmail(email: string): Promise<IUser | undefined> {
    const foundUserByEmail = await this.userDatabase.getUserByEmail(email);
    const mappedDbUserToUser = this.mapToUser(foundUserByEmail as IDbUser);
    return mappedDbUserToUser;
  }

  public generateJwtTokens(id: string ) {
    const accessToken = jwt.sign({ _id: id, type: "access" }, SECRET_KEY as string, {
      expiresIn: this.randomTokenTime(60, 30),
    });
    const refreshToken = jwt.sign({ _id: id, type: "refresh" }, SECRET_KEY as string, {
      expiresIn: "30d",
    });
    return { 'accessToken': accessToken, 'refreshToken': refreshToken };
  }

  public randomTokenTime(max: number, min: number): number{
        return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public  checkIfValidToken(refreshToken: string): jwt.JwtPayload {
    let decodedToken: string | jwt.JwtPayload;
    try {
        decodedToken = jwt.verify(refreshToken, SECRET_KEY as string);

    } catch (err) {
        throw Error('Token is not valid');
    }

    if ((decodedToken as IDecodedToken).type !== 'refresh') {
        throw Error('Token is not valid');
    }

    return decodedToken as jwt.JwtPayload;
  }

  private mapToUser(user: IDbUser | IApiUser): IUser | undefined{
    if(typeof user === 'undefined'){
        return undefined
    }

    const iUser: IUser = {
        _id: user._id?.toString(),
        email: user.email,
        password: user.password,
    }

    return iUser;
  }
}
