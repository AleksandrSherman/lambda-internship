import mysql from "mysql";
async function main() {
    const client = mysql.createConnection({
        host: "localhost",
        user: "root"
    });
    client.connect((err) => {
        if (err) {
            throw err;
        }
        ;
        console.log("connected");
    });
}
main();
//# sourceMappingURL=index.js.map