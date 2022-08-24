import { App } from "App";
import mysql from "mysql";

async function main(): Promise<void> {
  const client = mysql.createConnection({
      host: "localhost",
      user: "root"
  });

  client.connect();

  const app = new App([], 3000);

  app.listen();
}

main();
