import { App } from "./App.js";
import { UserConstroller } from "./controller/userController.js";
import { MongoClient } from "mongodb";
import { UserService } from "./service/userService.js";
import { UsersDatabase } from "./database/usersDatabase.js"

async function main(): Promise<void> {
    const client = await MongoClient.connect("mongodb://localhost:27017");

    const db = client.db("js-storage");

    const userDatabase = new UsersDatabase(db);

    const userService = new UserService(userDatabase)

    const userConstroller = new UserConstroller(userService)

    const app = new App([userConstroller], 3000);

    app.listen();
}

main();