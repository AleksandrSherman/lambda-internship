import { getTimeAndDate } from './core.js';

test('Task recieved: 7:35, 02.08.2022. Hours to finish: 3:30 hours. Expect to end: 13:30 02.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 2, 7, 35, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 2, 13, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(3.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 19:35, 02.08.2022. Hours to finish: 3:30 hours. Expect to end: 13:30 03.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 2, 19, 35, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 3, 13, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(3.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 23:59, 05.08.2022. Hours to finish: 24:30 hours. Expect to end: 16:30 10.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 5, 23, 59, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 10, 16, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(24.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 15:35, 06.08.2022. Hours to finish: 3:30 hours. Expect to end: 13:30 08.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 6, 15, 35, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 8, 13, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(3.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 9:03, 07.08.2022. Hours to finish: 8:30 hours. Expect to end: 18:30 08.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 7, 9, 3, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 8, 18, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(8.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

//02.08, 14:00 -> 67:30 ВТОРНИК
//03.08, 14:00 -> 58:30 СРЕДА
//04.08, 14:00 -> 49:30 ЧЕТВЕРГ
//05.08, 14:00 -> 40:30 ПЯТНИЦА ...
//05.08, 19:00 -> 35:30 ПЯТНИЦА 
//08.08, 10:00 -> 35:30 ПОНЕДЕЛЬНИК
//09.08, 10:00 -> 26:30 ВТОРНИК
//10.08, 10:00 -> 17:30 СРЕДА
//11.08, 10:00 -> 8:30 ЧЕТВЕРГ
//11.08, 18:30 -> 0:00 ЧЕТВЕРГ
test('Task recieved: 14:00, 02.08.2022. Hours to finish: 67:30 hours. Expect to end: 18:30 11.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 2, 14, 0, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 11, 18, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(67.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 14:00, 02.08.2022. Hours to finish: 75:30 hours. Expect to end: 17:30 12.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 2, 14, 0, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 12, 17, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(75.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

//02.08, 14:00 -> 103:30 ВТОРНИК
//03.08, 14:00 -> 94:30 СРЕДА
//04.08, 14:00 -> 85:30 ЧЕТВЕРГ
//05.08, 14:00 -> 76:30 ПЯТНИЦА
//05.08, 19:00 -> 71:30 ПЯТНИЦА 
//08.08, 10:00 -> 71:30 ПОНЕДЕЛЬНИК
//09.08, 10:00 -> 62:30 ВТОРНИК
//10.08, 10:00 -> 53:30 СРЕДА
//11.08, 10:00 -> 44:30 ЧЕТВЕРГ
//12.08, 10:00 -> 35:30 ПЯТНИЦА
//12.08, 19:00 -> 26:30 ПЯТНИЦА
//15.08, 10:00 -> 26:30 ПОНЕДЕЛЬНИК
//16.08, 10:00 -> 17:30 ВТОРНИК
//17.08, 10:00 -> 8:30 СРЕДА
//17.08, 18:30 -> 00:00 СРЕДА
test('Task recieved: 14:00, 02.08.2022. Hours to finish: 103:30 hours. Expect to end: 18:30 17.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 2, 14, 0, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 17, 18, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(103.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 19:35, 28.02.2022. Hours to finish: 1:30 hours. Expect to end: 11:30 1.03.2022.', () => {
    const recievedDate = new Date(2022, 1, 28, 19, 35, 0, 0);
    const expectedFinishDate = new Date(2022, 2, 1, 11, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(1.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 23:59, 2.08.2022. Hours to finish: 24:30 hours. Expect to end: 16:30 5.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 2, 23, 59, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 5, 16, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(24.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 23:59, 2.08.2022. Hours to finish: 1:30 hours. Expect to end: 11:30 3.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 2, 23, 59, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 3, 11, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(1.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 00:01, 2.08.2022. Hours to finish: 24:30 hours. Expect to end: 16:30 4.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 2, 0, 1, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 4, 16, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(24.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 00:01, 2.08.2022. Hours to finish: 1:30 hours. Expect to end: 11:30 2.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 2, 0, 1, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 2, 11, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(1.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 00:01, 5.08.2022. Hours to finish: 24:30 hours. Expect to end: 16:30 9.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 5, 0, 1, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 9, 16, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(24.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 23:59, 5.08.2022. Hours to finish: 1:30 hours. Expect to end: 11:30 8.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 5, 23, 59, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 8, 11, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(1.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})

test('Task recieved: 00:01, 5.08.2022. Hours to finish: 1:30 hours. Expect to end: 11:30 5.08.2022.', () => {
    const recievedDate = new Date(2022, 7, 5, 0, 1, 0, 0);
    const expectedFinishDate = new Date(2022, 7, 5, 11, 30, 0, 0);
    const actualFinishDate = getTimeAndDate(1.5, recievedDate);

    expect(actualFinishDate).toStrictEqual(expectedFinishDate);
})
