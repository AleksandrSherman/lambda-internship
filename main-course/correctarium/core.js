const preferences = {
    editAmountOfCharsPerHour: {
        'uk': 1333,
        'ru': 1333,
        'us': 333
    },
    minPrice: {
        'uk': 50,
        'ru': 50,
        'us': 120
    },
    oneCharPrice: {
        'uk': 0.05,
        'ru': 0.05,
        'us': 0.12
    },
    minTime: 1
}

export function getTimeAndDate(hoursToCorrectAllText, time) {

    while (true) {
        if (time.getDay() === 6 || time.getDay() === 0) { //check if weekend
            time.setDate(time.getDate() + 1);
            time.setHours(10);
            time.setMinutes(0);
            continue;
        }
        if (time.getHours() < 10) { //if real time hours less than 10, then start counting from 10 o'clock this day
            time.setHours(10);
            time.setMinutes(0);
            continue;
        }
        if (time.getHours() >= 19) { //if real time hours more than 19, then start counting from 10 o'clock next day
            time.setHours(10);
            time.setMinutes(0);
            time.setDate(time.getDate() + 1);
            continue;

        }

        if (hoursToCorrectAllText >= 9) { //if more than 9 hours to work, then go to next day

            if (time.getDay() === 5) { //if more than 9 hours to work on Friday, then add hours to 19 and go to the next day
                hoursToCorrectAllText -= 19 - time.getHours();
                time.setDate(time.getDate() + 1);
                continue;

            } else {
                hoursToCorrectAllText -= 9;
                time.setDate(time.getDate() + 1);
                continue;

            }
        }

        if ((time.getHours() + hoursToCorrectAllText) >= 19) { //if end time hours more than 19, then go to next day with (end time hours - 9)
            time.setHours(time.getHours() + Math.floor(hoursToCorrectAllText) - 9);

            if (hoursToCorrectAllText % 1 === 0.5) {
                time.setMinutes(time.getMinutes() + 30);
            }
            time.setDate(time.getDate() + 1);

        } else { // if all okay - get end time hours and minutes
            if (hoursToCorrectAllText % 1 === 0.5) {
                time.setMinutes(time.getMinutes() + 30);
            }
            time.setHours(time.getHours() + Math.floor(hoursToCorrectAllText));
        }

        break;
    }

    return time;

};

function getRounded(value) {
    if (value % 1 < 0.5 && value % 1 !== 0) {
        value = Math.round(value) + 0.5;
    } else if (value % 1 > 0.5) {
        value = Math.round(value);
    }
    return value;
};

export function getTimeOfAllWork(amountOfChars, extension, lang) {
    let timeToCorrectAllText = ( amountOfChars / preferences.editAmountOfCharsPerHour[lang] );

    if (extension !== '.doc' && extension !== '.docx' && extension !== '.rtf') {
        timeToCorrectAllText += timeToCorrectAllText * 0.2;
    }

    if ( ( timeToCorrectAllText + 0.5 ) <= 1) {
        timeToCorrectAllText = preferences.minTime;
    } else {
        timeToCorrectAllText += 0.5;
    };

    timeToCorrectAllText = getRounded(+timeToCorrectAllText.toFixed(2));

    return timeToCorrectAllText;
}

export function getPriceOfAllWork(amountOfChars, extension, lang) {
    let priceOfAllWork = (amountOfChars * preferences.oneCharPrice[lang]);

    if (priceOfAllWork < preferences.minPrice[lang]) {
        priceOfAllWork = preferences.minPrice[lang];
    }

    if (extension !== '.doc' && extension !== '.docx' && extension !== '.rtf') {
        priceOfAllWork += priceOfAllWork * 0.2;
    };

    return priceOfAllWork;
}