import { getTimeOfAllWork } from "./core";

test('Task recieved: 1333 symbols. Extension : \'.doc\' . Language: \'uk\'. Expect to get: 1:30 hours', () => {
    const recievedDate = {
        'symbols': 1333,
        'extension': '.doc',
        'language': 'uk'
    };
    const expectedFinishDate = 1.5;
    const actualFinishDate = getTimeOfAllWork(recievedDate.symbols, recievedDate.extension, recievedDate.language);

    expect(actualFinishDate).toBe(expectedFinishDate);
})

test('Task recieved: 1333 symbols. Extension : \'.jpg\' . Language: \'uk\'. Expect to get: 2:00 hours', () => {
    const recievedDate = {
        'symbols': 1333,
        'extension': '.jpg',
        'language': 'uk'
    };
    const expectedFinishDate = 2;
    const actualFinishDate = getTimeOfAllWork(recievedDate.symbols, recievedDate.extension, recievedDate.language);

    expect(actualFinishDate).toBe(expectedFinishDate);
})

test('Task recieved: 1333 symbols. Extension : \'.doc\' . Language: \'us\'. Expect to get: 4:30 hours', () => {
    const recievedDate = {
        'symbols': 1333,
        'extension': '.doc',
        'language': 'us'
    };
    const expectedFinishDate = 4.5;
    const actualFinishDate = getTimeOfAllWork(recievedDate.symbols, recievedDate.extension, recievedDate.language);

    expect(actualFinishDate).toBe(expectedFinishDate);
})

test('Task recieved: 123000 symbols. Extension : \'.doc\' . Language: \'ru\'. Expect to get: 93 hours', () => {
    const recievedDate = {
        'symbols': 123000,
        'extension': '.doc',
        'language': 'ru'
    };
    const expectedFinishDate = 93;
    const actualFinishDate = getTimeOfAllWork(recievedDate.symbols, recievedDate.extension, recievedDate.language);

    expect(actualFinishDate).toBe(expectedFinishDate);
})

test('Task recieved: 123000 symbols. Extension : \'.jpg\' . Language: \'ru\'. Expect to get: 111:30 hours', () => {
    const recievedDate = {
        'symbols': 123000,
        'extension': '.jpg',
        'language': 'ru'
    };
    const expectedFinishDate = 111.5;
    const actualFinishDate = getTimeOfAllWork(recievedDate.symbols, recievedDate.extension, recievedDate.language);

    expect(actualFinishDate).toBe(expectedFinishDate);
})

test('Task recieved: 1 symbols. Extension : \'.doc\' . Language: \'uk\'. Expect to get: 1 hour', () => {
    const recievedDate = {
        'symbols': 1,
        'extension': '.doc',
        'language': 'uk'
    };
    const expectedFinishDate = 1;
    const actualFinishDate = getTimeOfAllWork(recievedDate.symbols, recievedDate.extension, recievedDate.language);

    expect(actualFinishDate).toBe(expectedFinishDate);
})

test('Task recieved: 1 symbols. Extension : \'.jpg\' . Language: \'uk\'. Expect to get: 1 hour', () => {
    const recievedDate = {
        'symbols': 1,
        'extension': '.jpg',
        'language': 'uk'
    };
    const expectedFinishDate = 1;
    const actualFinishDate = getTimeOfAllWork(recievedDate.symbols, recievedDate.extension, recievedDate.language);

    expect(actualFinishDate).toBe(expectedFinishDate);
})
