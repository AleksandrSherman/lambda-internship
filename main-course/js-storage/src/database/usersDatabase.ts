import { Db, Collection } from "mongodb";

export class UsersDatabase{
    private collection: Collection;

    constructor(private db: Db){
        this.collection = db.collection("usersRouts");
    }
}