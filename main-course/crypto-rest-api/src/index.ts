import { App } from "./App.js";
import mysql from "mysql2/promise";
import { CryptoDatabase } from "./database/cryptoDatabase.js";
import { CryptoService } from "./service/cryptoService.js";
import { CryptoCurrencyController } from "./controller/cryptoCurrencyController.js";
import { CryptoCurrencyApi } from "./Api/cryptoCurrencyApi.js";


async function main(): Promise<void> {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    user: "sqluser",
    database: "crypto_currency",
    port: 3306,
    password: "password",
  });

  const apiResponses = new CryptoCurrencyApi();
  await apiResponses.getResponses();
  const mappedResponses = await apiResponses.mapResponses();

  const cryptoDatabase = new CryptoDatabase(connection, apiResponses);
  await cryptoDatabase.initializeTables();
  await cryptoDatabase.putGeneralDataInDb(mappedResponses);
  cryptoDatabase.makeIntervalRequests();
  
  const cryptoService = new CryptoService(cryptoDatabase);

  const cryptoCurrenncyController = new CryptoCurrencyController(cryptoService);
  
  const app = new App([cryptoCurrenncyController], 3000);

  app.listen();
}

main();
