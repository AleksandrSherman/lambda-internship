import express, { Application } from "express";
import { Controller } from "./controller/base.js"

export class App{
    private port: number;
    private controllers: Controller[];
    private app: Application;

    constructor(controllers: Controller[], port: number){
        this.app = express();
        this.port = port;
        this.controllers = controllers;

        this.initializeMiddlewares();
        this.initializeControllers();
    }

    public listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server started on port: ${this.port}`)
        })
    }

    private initializeMiddlewares(){
        this.app.use(express.json());
    }

    private initializeControllers(){
        this.controllers.forEach((controller) => {
            this.app.use(controller.path, controller.router)
        })
    }
}