import { getPriceOfAllWork } from "./core";

test('Task recieved: 40 symbols. Extension : \'.doc\' . Language: \'uk\'. Expect to get: 50 UAH', () => {
    const recievedDate = {
        'symbols': 40,
        'extension': '.doc',
        'language': 'uk'
    };
    const expectedFinishDate = 50;
    const actualFinishDate = getPriceOfAllWork(recievedDate.symbols, recievedDate.extension, recievedDate.language);

    expect(actualFinishDate).toBe(expectedFinishDate);
})

test('Task recieved: 40 symbols. Extension : \'.jpg\' . Language: \'uk\'. Expect to get: 60 UAH', () => {
    const recievedDate = {
        'symbols': 40,
        'extension': '.jpg',
        'language': 'uk'
    };
    const expectedFinishDate = 60;
    const actualFinishDate = getPriceOfAllWork(recievedDate.symbols, recievedDate.extension, recievedDate.language);

    expect(actualFinishDate).toBe(expectedFinishDate);
})

test('Task recieved: 1333 symbols. Extension : \'.jpg\' . Language: \'uk\'. Expect to get: 79.98 UAH', () => {
    const recievedDate = {
        'symbols': 1333,
        'extension': '.jpg',
        'language': 'uk'
    };
    const expectedFinishDate = 79.98;
    const actualFinishDate = getPriceOfAllWork(recievedDate.symbols, recievedDate.extension, recievedDate.language);

    expect(actualFinishDate).toBe(expectedFinishDate);
})

test('Task recieved: 10201 symbols. Extension : \'.doc\' . Language: \'us\'. Expect to get: 1224.12 UAH', () => {
    const recievedDate = {
        'symbols': 10201,
        'extension': '.doc',
        'language': 'us'
    };
    const expectedFinishDate = 1224.12;
    const actualFinishDate = getPriceOfAllWork(recievedDate.symbols, recievedDate.extension, recievedDate.language);

    expect(actualFinishDate).toBe(expectedFinishDate);
})