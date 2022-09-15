import mysql from "mysql2/promise";
import { Currency } from "service/userService.js";

export class UsersDatabase {
    constructor(private db: mysql.Connection) { }

    public async createGeneralTables() {
        await this.db.execute(`CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTO_INCREMENT, 
            user_id INT,
            UNIQUE (user_id) );`);

        await this.db.execute(`CREATE TABLE IF NOT EXISTS user_favourites ( id INT PRIMARY KEY AUTO_INCREMENT, 
            favourite_currency VARCHAR(255),
            user_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id),
            CONSTRAINT currency_user UNIQUE (favourite_currency, user_id)
        );`);
    }

    public async addToFavourites(userId: number, currency: string): Promise<string> {
        await this.db.execute(
            `INSERT IGNORE INTO users (user_id) VALUES (?)`, [userId]
        );
        const [userIdInUsers] = await this.db.execute(
            `SELECT id FROM users WHERE user_id = (?)`, [userId]
        );
        
        await this.db.execute(
            `INSERT IGNORE INTO user_favourites (favourite_currency, user_id) VALUES (?, ?)`, [currency, userIdInUsers[0].id]
        );

        return "Added to your favourites";
    }

    public async removeFromFavourites(userId: number, currency: string) {
        await this.db.execute(
            `INSERT IGNORE INTO users (user_id) VALUES (?)`, [userId]
        );
        const [userIdInUsers] = await this.db.execute(
            `SELECT id FROM users WHERE user_id = ?`, [userId]
        );
        await this.db.execute(
            `DELETE FROM user_favourites WHERE favourite_currency = ? AND user_id = ?`, [currency, userIdInUsers[0].id]
        );
        return "Removed from your favourites";
    }


    public async getFavouriteCurrency(userId: number): Promise<Currency[]> {
        const [response] = await this.db.execute(`SELECT favourite_currency FROM user_favourites
                LEFT JOIN users ON user_favourites.user_id = users.id
                WHERE users.user_id = ?;`, [userId]);

        const mappedResponse: Currency[] = this.mapToFavouriteCurrency(response as mysql.RowDataPacket[] | mysql.OkPacket[]);

        return mappedResponse;
    }
 
    private mapToFavouriteCurrency(response: mysql.RowDataPacket[] | mysql.OkPacket[]){
        const tmpArr: Currency[] = [];
        response.map(element => {
            const tmpObject: Currency = {
                favourite_currency: element.favourite_currency
            };
            tmpArr.push(tmpObject)
        })
        return tmpArr;
    }
}

