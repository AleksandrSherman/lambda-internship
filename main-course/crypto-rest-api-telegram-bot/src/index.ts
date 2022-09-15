import "dotenv/config";

import TelegramBot from "node-telegram-bot-api";
import mysql from "mysql2/promise";
import { UsersController } from "./controller/usersController.js";
import { UsersDatabase } from "./database/userDatabase.js";
import { UserService } from "./service/userService.js";
import { CurrenciesApi } from "./api/currenciesApi.js";
import { App } from "./App.js";

const token = process.env.TOKEN!;
const webhookUrl = process.env.URL!;

const avaliableCurrencies: string[] = [
  "BTC",
  "ETH",
  "USDT",
  "USDC",
  "BNB",
  "BUSD",
  "XRP",
  "ADA",
  "SOL",
  "DOGE",
  "DOT",
  "MATIC",
  "DAI",
  "SHIB",
  "TRX",
  "AVAX",
  "LEO",
  "ETC",
  "WBTC",
  "UNI",
  "LTC",
  "ATOM",
  "FTT",
  "LINK",
  "NEAR",
  "CRO",
  "XMR",
  "XLM",
  "BCH",
  "ALGO",
];

const favouriteAddRemoveButton = {
reply_markup: {
  inline_keyboard: [
    [
      {
        text: "Add to favourite",
        callback_data: "add",
      },
      {
        text: "Remove from favourite",
        callback_data: "remove",
      },
    ],
  ],
},
};

async function main() {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    user: "sqluser",
    database: "crypto_currency_telegram",
    port: 3306,
    password: "password",
  });

  const bot: TelegramBot = new TelegramBot(token);
  await bot.setWebHook(webhookUrl);
  const currencyApi = new CurrenciesApi(avaliableCurrencies);

  const userDatabase = new UsersDatabase(connection);
  await userDatabase.createGeneralTables();

  const userServiece = new UserService(userDatabase);

  const usersController = new UsersController(userServiece, bot, currencyApi, avaliableCurrencies, favouriteAddRemoveButton);

  const app = new App([usersController], 3001);
  app.listen()
}
main();


