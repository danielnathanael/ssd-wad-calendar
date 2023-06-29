export function getDayCountInMonth(year, month) {
    const date = new Date(year, month - 1, 1)

    date.setMonth(date.getMonth())
    date.setDate(date.getDate() - 1)

    return date.getDate()
}

export function getMonthName(month) {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    return monthNames[month]
}