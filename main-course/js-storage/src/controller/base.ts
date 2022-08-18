import { Router } from "express";

export abstract class Controller{
    public readonly path: string;
    public readonly router: Router;

    constructor(path: string){
        this.path = path;
        this.router = Router();
    }
}