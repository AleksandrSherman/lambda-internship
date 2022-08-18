import express from "express";
class App {
    constructor(controllers, port) {
        this.listen = () => {
            this.app.listen(this.port, () => {
                console.log(`App listening on the port ${this.port}`);
            });
        };
        this.controllers = controllers;
        this.port = port;
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers();
    }
    initializeMiddlewares() {
        this.app.use(express.json());
    }
    initializeControllers() {
        this.controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router);
        });
    }
}
export default App;
//# sourceMappingURL=App.js.map