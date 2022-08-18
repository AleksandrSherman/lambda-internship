import App from "./App.js";
import { MongoClient } from "mongodb";
import { UsersDatabase } from "./database/usersDatabase.js";
import { AuthService } from "./service/authService.js";
import { AuthController } from "./controller/authController.js";
import { UserService } from "./service/userService.js";
import { UserController } from "./controller/userController.js";
async function main() {
    const client = await MongoClient.connect("mongodb://localhost:27017");
    const db = client.db("authorization");
    const userDatabase = new UsersDatabase(db);
    const authService = new AuthService(userDatabase);
    const userService = new UserService(userDatabase);
    const authController = new AuthController(authService);
    const userController = new UserController(userService);
    const app = new App([authController, userController], 3000);
    app.listen();
}
main();
//# sourceMappingURL=index.js.map