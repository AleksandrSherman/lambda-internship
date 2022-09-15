import { CurrenciesApi } from "api/currenciesApi.js";
import TelegramBot from "node-telegram-bot-api";
import { UserService } from "service/userService.js";
import { Controller } from "./base.js";


export class UsersController extends Controller {

  constructor(private userService: UserService, private bot: TelegramBot, private currencyApi: CurrenciesApi, private avaliableCurrencies: string[], private favouriteAddRemoveButton) {
    super("/bot")
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.webHook);
    this.bot.on("message", this.onMessage);
    this.bot.on("callback_query", this.onCallbackQuery);
  }

  private webHook = async (req, res) => {
    const { body } = req;
    // this.bot.processUpdate(body)
    this.onMessage(body);
    res.sendStatus(200);
  }

  private onMessage = async (msg) => {
    const chatId: number = msg.chat.id;
    const userInputText: string = msg.text;
    const userId = msg.from.id;

    if (userInputText === "/start") {
      await this.bot.sendMessage(
        chatId,
        `Hello, i am Crypto TelegramBot\nFor more help type "/help"`
      );
    } else if (userInputText === "/help") {
      await this.bot.sendMessage(chatId, `Some help here`);
    } else if (userInputText === "/listRecent") {
      const response: string = await this.currencyApi.getListOfCurrencies();
      await this.bot.sendMessage(chatId, response);
    } else if (this.avaliableCurrencies.includes((userInputText).substring(1))) {
      const response: any = await this.currencyApi.getAverageCurrency(userInputText);

      await this.bot.sendMessage(chatId, response, this.favouriteAddRemoveButton);

    } else if (userInputText.includes("/addToFavourite")) {

      if (userInputText.split(" ").length === 2) {
        const currency: string = msg.text.split(" ")[1];

        if (this.avaliableCurrencies.includes(currency)) {
          const response: string = await this.userService.addToFavourites(userId, currency);

          await this.bot.sendMessage(chatId, response);
        } else {

          await this.bot.sendMessage(chatId, "Unsupported currency");
        }
      } else {
        await this.bot.sendMessage(chatId, "Type \"/addToFavourite <ONLY_ONE_CURRENCY_HERE>\"");
      }

    } else if (userInputText.includes("/removeFromFavourite")) {

      if (userInputText.split(" ").length === 2) {
        const currency: string = msg.text.split(" ")[1];

        if (this.avaliableCurrencies.includes(currency as string)) {
          const response: string = await this.userService.removeFromFavourites(userId, currency);

          await this.bot.sendMessage(chatId, response); response
        } else {
          await this.bot.sendMessage(chatId, "Unsupported currency");
        }
      } else {
        await this.bot.sendMessage(chatId, "Type \"/removeFromFavourite <ONE_CURRENCY_HERE>\"");
      }

    } else if (userInputText === "/listFavourite") {
      const response = await this.userService.getFavouriteCurrency(userId);

      await this.bot.sendMessage(chatId, `Your favourite currencies: ${response}`);
    } else {
      await this.bot.sendMessage(chatId, "Unknown command");
    }
  };

  private onCallbackQuery = async (query) => {
    const userChoice: string = query.data;
    const userId: number = query.from.id;
    const currency: string = query.message.text.split("\n")[0];
    const chatId: number = query.message.chat.id;

    if (userChoice === "add") {
      const response = await this.userService.addToFavourites(userId, currency);;
      await this.bot.sendMessage(chatId as number, response);
    }

    if (userChoice === "remove") {
      const response = await this.userService.removeFromFavourites(userId, currency);
      await this.bot.sendMessage(chatId as number, response);
    }
  };
}
