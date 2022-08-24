import { CryptoService } from "service/cryptoService";
import { Controller } from "./base";

export class CryptoController extends Controller{
    constructor(private cryptoService: CryptoService){
        super("/")
    }
}