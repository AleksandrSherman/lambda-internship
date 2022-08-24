import { Controller } from "controller/base";
import express, { Application } from "express";

export class App{
    private port: number;
    private app: Application;
    private controllers: Controller[];

    constructor(controllers: Controller[], port: number){
        this.app = express();
        this.port = port;
        this.controllers = controllers;

        this.initializeMiddeware();
        this.initializeControllers();
    }

    public listen(){
        this.app.listen((port: number) => {
            console.log(`Server runs on port ${port}`);
        })
    } 

    private initializeMiddeware(){
        this.app.use(express.json())
    }

    private initializeControllers(){
        this.controllers.forEach((controller)=>{
            this.app.use(controller.path, controller.router)
        })
    }
}