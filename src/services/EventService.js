import { generateHexColor } from "../utilities/color";

function EventService() {
    function addEvent(selectedDate, name, startTime, endTime, participant) {
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month starts from 0
        const year = String(selectedDate.getFullYear());

        const events = getAllEvent(year, month)

        while(true) {
            let color = generateHexColor()

            for(let i = 0 ; i<events.length ; i++) {
                if(events[i].data.color === color) {
                    color = generateHexColor()
                    continue
                }
            }

            const key = `${day}-${month}-${year}-${startTime}-${endTime}`

            localStorage.setItem(key, JSON.stringify({
                name, startTime, endTime, participant, color
            }))

            return
        }
    }

    function updateEvent(selectedId, selectedDate, name, startTime, endTime, participant) {
        localStorage.setItem(selectedId, JSON.stringify({
            name, startTime, endTime, participant
        }))
    }

    function getAllEvent(year, month) {
        const keys = Object.keys(localStorage)

        return keys.filter((key) => {
            const [_, m, y] = key.split('-')

            return (
              parseInt(month, 10) === parseInt(m, 10) &&
              parseInt(year, 10) === parseInt(y, 10)
            )
        }).map(key => {
            return {
                'id': key,
                'data': JSON.parse(localStorage.getItem(key))
            }
        })
    }

    function getEvent(key) {
        return JSON.parse(localStorage.getItem(key))
    }

    function removeAllEvent() {
        const keys = Object.keys(localStorage)
        keys.map(key => localStorage.removeItem(key))
    }

    function removeEvent(key) {
        localStorage.removeItem(key)
    }

    return {
        addEvent,
        updateEvent,
        getAllEvent,
        getEvent,
        removeAllEvent,
        removeEvent
    }
}

export default EventService