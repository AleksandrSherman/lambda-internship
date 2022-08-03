import 'dotenv/config';

import express from "express";
import fs from 'fs';

const port = process.env.PORT;

const app = express();

const ipLocations = [];

app.get('/', (req, res) => {

    const userIp = +(req.ip.split('.').join(''));

    // find country from ip range
    let countryName;
    for (const value of ipLocations) {

        if (userIp >= value.rangeA && userIp <= value.rangeB) {
            countryName = value.country;
            break;
        }

    }

    res.send({ ip: req.ip, country: 'countryName' })
})

function main() {

    const cvsFileArray = fs.readFileSync('./ip-location.CSV', 'utf8').split('\n');

    //json from csv
    for (const row of cvsFileArray) {
        const splittedCvsFileArray = row.split(',');

        const country = splittedCvsFileArray[3].substring(1, splittedCvsFileArray[3].length - 1);
        const rangeA = +(splittedCvsFileArray[0].substring(1, splittedCvsFileArray[0].length - 1));
        const rangeB = +(splittedCvsFileArray[1].substring(1, splittedCvsFileArray[1].length - 1));

        ipLocations.push({ rangeA, rangeB, country });
    }

    app.listen(port, () => {
        console.log(`App was started on port: ${port}`)
    });
}

main();
