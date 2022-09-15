import { UsersDatabase } from "database/userDatabase.js";

export interface Currency {
    favourite_currency: string;
}

export class UserService {
    constructor(private userDatabase: UsersDatabase) { }

    public async addToFavourites(userId: number, currency: string): Promise<string> {
        try {
            const response: string = await this.userDatabase.addToFavourites(userId, currency);

            return response;
        } catch (err) {
            return "Something went wrong. Try again later...";
        }
    }

    public async removeFromFavourites(userId: number, currency: string) {
        try {
            const response: string = await this.userDatabase.removeFromFavourites(userId, currency);

            return response;
        } catch (err) {
            return "Something went wrong. Try again later...";
        }
    };

    public async getFavouriteCurrency(userId: number) {
        try {
            const response = await this.userDatabase.getFavouriteCurrency(userId);
            const mappedResponse: string = this.mapToFavouriteResponseString(response);

            return mappedResponse;
        } catch (err) {
            return "Something went wrong. Try again later...";
        }
    }

    private mapToFavouriteResponseString(response: Currency[]) {
        let resultString: string = "";

        response.forEach(element => {
            resultString += `/${element.favourite_currency} `;
        });

        return resultString.substring(0, resultString.length - 1);
    }
}
