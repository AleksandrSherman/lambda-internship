const fs = require('fs');


function main() {
    fileContent = JSON.parse(fs.readFileSync('/Users/aleksandr/Projects/lambda-internship/main-course/vacations/vacations.json', 'utf-8'));
    
    resultJson = {};
    for (const elemFromFile of fileContent) {

        const userId = elemFromFile.user._id;
        const userName = elemFromFile.user.name;
        const startVacationDate = elemFromFile.startDate;
        const endVacationDay = elemFromFile.endDate;

        //check if id is already exist in file, push new vacations. If isn't exist, then create it with userId key;
        if (userId in resultJson) {
            const newVacations = { startDate: startVacationDate, endDate: endVacationDay };

            resultJson[userId].vacationDays.push(newVacations);
        } else {
            resultJson[userId] = {
                user_id: userId,
                user_name: userName,
                vacationDays: [{ startDate: startVacationDate, endDate: endVacationDay }]
            };

        }
    }

    fs.writeFileSync('newVacations.json', JSON.stringify(Object.values(resultJson)));
    console.log(Object.values(resultJson))
}

main();