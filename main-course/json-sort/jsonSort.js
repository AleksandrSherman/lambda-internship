import axios from 'axios';

let isDoneTrue = 0;
let isDoneFalse = 0;

function countIsDone(object) {
    for (const key in object) {
        if (object.isDone === true) {
            isDoneTrue++;
            return;
        } else if (object.isDone === false) {
            isDoneFalse++;
            return;
        } else if (typeof object[key] === 'object') {
            countIsDone(object[key]);
        }
    }
}


async function main() {

    const endPoints = [
        'https://jsonbase.com/lambdajson_type1/793',
        'https://jsonbase.com/lambdajson_type1/955',
        'https://jsonbase.com/lambdajson_type1/231',
        'https://jsonbase.com/lambdajson_type1/931',
        'https://jsonbase.com/lambdajson_type1/93',
        'https://jsonbase.com/lambdajson_type2/342',
        'https://jsonbase.com/lambdajson_type2/770',
        'https://jsonbase.com/lambdajson_type2/491',
        'https://jsonbase.com/lambdajson_type2/281',
        'https://jsonbase.com/lambdajson_type2/718',
        'https://jsonbase.com/lambdajson_type3/310',
        'https://jsonbase.com/lambdajson_type3/806',
        'https://jsonbase.com/lambdajson_type3/469',
        'https://jsonbase.com/lambdajson_type3/258',
        'https://jsonbase.com/lambdajson_type3/516',
        'https://jsonbase.com/lambdajson_type4/79',
        'https://jsonbase.com/lambdajson_type4/706',
        'https://jsonbase.com/lambdajson_type4/521',
        'https://jsonbase.com/lambdajson_type4/350',
        'https://jsonbase.com/lambdajson_type4/64'
    ]

    for (const link of endPoints) {
        const response = await axios.get(link);
        countIsDone(response.data);
    }

    console.log(`True: ${isDoneTrue}, False: ${isDoneFalse}`)
}
main();