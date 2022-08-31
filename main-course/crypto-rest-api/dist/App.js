import express from "express";
export class App {
    constructor(controllers, port) {
        this.app = express();
        this.port = port;
        this.controllers = controllers;
        this.initializeMiddlewares();
        this.initializeControllers();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server started on port: ${this.port}`);
        });
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
//# sourceMappingURL=App.js.map