export function getTimeInterval() {
    const timeArray = [];

    for (let hours = 0; hours <= 23; hours++) {
        for (let minutes = 0; minutes <= 45; minutes += 15) {
        const hoursString = hours.toString().padStart(2, "0");
        const minutesString = minutes.toString().padStart(2, "0");
        const timeString = `${hoursString}.${minutesString}`;
        timeArray.push(timeString);
        }
    }

    return timeArray;
}