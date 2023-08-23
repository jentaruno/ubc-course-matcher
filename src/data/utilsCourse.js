export function convertDay(day) {
    const days = {
        "MO": "Mon",
        "TU": "Tue",
        "WE": "Wed",
        "TH": "Thu",
        "FR": "Fri"
    }
    return days[day];
}

// Takes classTimes object and returns days in string e.g. "Tue Thu"
export function getCalDays(classTimes) {
    if (Array.isArray(classTimes) && classTimes.length > 0) {
        return classTimes
            .map(e => e.day)
            .map(e => {
                if (e.length === 2 && e === e.toUpperCase()) {
                    return convertDay(e);
                } else {
                    return e;
                }
            })
            .join(", ");
    } else {
        return "";
    }
}

// Takes classTimes object and returns times in string e.g. "11.00-12.00"
// - If time isn't always the same, flag first time of the week e.g. "11.00-12.00*"
export function getCalTimes(classTimes) {
    if (Array.isArray(classTimes) && classTimes.length > 0) {
        const times = classTimes.map(e => e.start + "-" + e.end);
        if (times.every(e => times.every(f => e === f))) {
            return times[0];
        } else {
            return times[0] + "*";
        }
    } else {
        return "";
    }
}

// Takes a user's courses array and returns class times (array of strings)
export function getAllClassTimes(courses) {
    let classTimes = [];
    courses.map(e => {
        classTimes = classTimes.concat(e.classTimes)
        return e;
    });
    return classTimes;
}

// Time string "18:00" to Date object
export function stringToDate(time) {
    var date = new Date();
    var parts = time.split(':');
    date.setHours(parts[0]);
    date.setMinutes(parts[1]);
    return date;
}