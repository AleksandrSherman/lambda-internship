export class UsersDataBase {
    constructor(client) {
        this.dataBase = client.db('authorization');
        this.collection = this.dataBase.collection('users');
    }
}
//# sourceMappingURL=userDatabase.js.map