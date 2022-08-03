import 'dotenv/config';

import { getTimeAndDate, getTimeOfAllWork, getPriceOfAllWork } from './core.js';
import express from 'express';

const app = express();
app.use(express.json());


app.post('/post', (req, res) => {
    const lang = req.body.language;
    const extension = req.body.mimetype;
    const amountOfChars = req.body.count;

    if (typeof lang === 'undefined') {
        return res.status(400).json({ error: 'Body should contain \'language\' parameter' });
    } 
    if(!['uk', 'ru', 'us'].includes(lang)){
        return res.status(400).json({ error: 'You could specify one of this languages [\'uk\', \'us\', \'ru\']' });
    }
    if (typeof extension === 'undefined') {
        return res.status(400).json({ error: 'Body should contain \'mimetype\' parameter' });
    }
    if (typeof amountOfChars === 'undefined') {
        return res.status(400).json({ error: 'Body should contain \'count\' parameter' });
    }

    const hoursToCorrectAllText = getTimeOfAllWork(amountOfChars, extension, lang);
    const priceOfAllWork = getPriceOfAllWork(amountOfChars, extension, lang);
    const finishDate = getTimeAndDate(hoursToCorrectAllText, new Date());

    const response = {
        "price": priceOfAllWork.toFixed(2),
        "time": hoursToCorrectAllText,
        "deadline_date": finishDate
    }

    return res.status(200).json(response);
});

function main() {
    const port = process.env.PORT;

    app.listen(port, () => {
        console.log(`The server started on port: ${port}`);
    });
};

main();


