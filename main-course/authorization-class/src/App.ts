import express, { Application } from "express";
import { Controller } from "./controller/base.js";

class App {
    private port: number;
    public readonly app: Application;
    private controllers: Controller[];

    constructor(controllers: Controller[], port: number){
        this.controllers = controllers;
        this.port = port;
        this.app = express();

        this.initializeMiddlewares();
        this.initializeControllers();
    }

    public listen = () => {
        this.app.listen(this.port, () => {
          console.log(`App listening on the port ${this.port}`);
        });
      };

    private initializeMiddlewares(){
        this.app.use(express.json());
    }

    private initializeControllers(){
        this.controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router);
        })
    }
}

export default App;