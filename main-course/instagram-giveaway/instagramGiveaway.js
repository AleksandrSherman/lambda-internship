const fs = require('fs');

function main() {
    console.time('time');
    const files = fs.readdirSync('./2kk_words_400x400');
    const uniqueElem = new Set();
    const atLeastTen = {};
    let counterInAllFiles = 0;
    let counterInTenFiles = 0;

    for (const file of files) {
        const fileContent = fs.readFileSync(`./2kk_words_400x400/${file}`, 'utf-8').split('\n');

        fileContent.forEach(element => {
            uniqueElem.add(element);
        });

        for (const value of uniqueElem) {
            if (atLeastTen[value]) {
                atLeastTen[value]++;
            } else {
                atLeastTen[value] = 1;
            }
        }
    }

    for (const key in atLeastTen) {
        if (atLeastTen[key] >= 10) {
            counterInTenFiles++;
        }
    }

    for (const key in atLeastTen) {
        if (atLeastTen[key] === 20) {
            counterInAllFiles++;
        } 
    }
    console.log(`Unique elements: ${uniqueElem.size},
At least in 10 files: ${counterInTenFiles},
In all 20 files: ${counterInAllFiles}`)
    console.timeEnd('time');
}

main();