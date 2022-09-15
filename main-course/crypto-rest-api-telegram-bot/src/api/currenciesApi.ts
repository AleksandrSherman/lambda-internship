import axios from "axios";


export class CurrenciesApi {
    constructor(private avaliableCurrencies: string[]) { }

    public async getListOfCurrencies() {
        const response: any = await axios.get("http://127.0.0.1:3000/currencies");
        const mappedResponse = this.mapAllCurrenciesResponse(response, this.avaliableCurrencies);
        return mappedResponse;
    }

    public async getAverageCurrency(userInputText: string): Promise<string> {
        const response = await axios.get(
            `http://127.0.0.1:3000/currencies/${userInputText.substring(
                1
            )}?interval=1440`);

        const outputMessage: string = this.mapResponseByInterval(response, (userInputText as string).substring(1));
        return outputMessage;
    }

    private mapAllCurrenciesResponse(response: any, avaliableCurrencies: string[]): string {
        let responseString: string = "";

        for (const key in response.data) {
            if (avaliableCurrencies.includes(key)) {
                responseString += `/${key} ${response.data[key].toFixed(3)}$ \n`;
            }
        }

        return responseString;
    }

    private mapResponseByInterval(response: any, currentCurrency: string): string {
        let responseString: string = `${currentCurrency}\n`;
        let interval: number = 30;

        while (interval <= 1440) {
            const currentTimeStamp = new Date();
            currentTimeStamp.setHours(currentTimeStamp.getHours() - 3);
            const intervalTime = new Date(
                currentTimeStamp.setMinutes(currentTimeStamp.getMinutes() - interval)
            ).getTime();
            const arrPrice: number[] = [];
            let resultPrice: number = 0;

            for (const key in response.data) {
                if (+key >= +intervalTime) {
                    arrPrice.push(response.data[key]);
                }
            }

            arrPrice.forEach((element) => {
                resultPrice += element;
            });

            resultPrice = resultPrice / arrPrice.length;

            responseString += `${interval / 60} hours:\nPrice:${resultPrice.toFixed(
                3
            )}$ \n\n`;

            if (interval === 60) {
                interval *= 3;
            } else {
                interval *= 2;
            }
        }

        return responseString;
    }

}