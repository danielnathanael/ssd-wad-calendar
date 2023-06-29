import React, { useEffect, useMemo, useState } from 'react'
import { getDayCountInMonth, getMonthName } from '../../utilities/date';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import EventService from '../../services/EventService';
import EventModal from '../components/EventModal';
import './style.css';

function Home() {
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isCompact, setIsCompact] = useState(false)
  
    const events = useMemo(() => {
      return EventService().getAllEvent(currentDate.getFullYear(), currentDate.getMonth() + 1)
    }, [currentDate, isModalVisible])

    const emptyDays = useMemo(() => {
      const t = new Date(currentDate)
      t.setDate(1)
      return new Array(t.getDay()).fill(0)
    }, [currentDate])
    
    const days = useMemo(() => {
      return new Array(getDayCountInMonth(currentDate.getFullYear(), currentDate.getMonth())).fill().map((_, index) => index + 1)
    }, [currentDate])

    const daysOfTheWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]
  
    useEffect(() => {
      const onResize = () => {
        if(window.innerWidth < 800) {
          setIsCompact(true)
        } else {
          setIsCompact(false)
        }
      }
  
      window.addEventListener('resize', onResize)
  
      return () => {
        window.removeEventListener('resize', onResize)
      }
    }, [])
  
    const onCloseModal = () => {
      setIsModalVisible(false)
      setSelectedDate(null)
      setSelectedId(null)
    }
  
    const onPrevious = () => {
      const temp = new Date(currentDate)
      temp.setMonth(currentDate.getMonth() - 1)
      setCurrentDate(temp)
    }
  
    const onNext = () => {
      const temp = new Date(currentDate)
      temp.setMonth(currentDate.getMonth() + 1)
      setCurrentDate(temp)
    }
  
    return (
      <div className="App">
        <div className="top-container">
            <button className="top-button" onClick={onPrevious}>
              <FaAngleLeft />
            </button>
            <div className="top-title">{getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}</div>
            <button className="top-button" onClick={onNext}>
            <FaAngleRight />
            </button>
        </div>
        <div className="calendar-container">
          <div className="calendar-header">
            {
              daysOfTheWeek.map((element, index) => {
                if(isCompact) {
                  return <div key={index}>{element.substring(0, 3)}</div>
                }
                return <div key={index}>{element}</div>
              })
            }
          </div>
          <div className='calendar-content'>
            {
              emptyDays.map((_, index) => {
                return <div key={index} className='calendar-item-container-disabled'></div>
              })
            }
            {
              days.map((element, index) => {
                const dayEvents = events.filter((evt) => {
                  const [day, month, year] = evt.id.split('-')
                  const parsedDay = parseInt(day, 10)
                  const parsedMonth = parseInt(month, 10)
                  const parsedYear = parseInt(year, 10)
  
                  return (
                    element === parsedDay &&
                    currentDate.getMonth() + 1 === parsedMonth &&
                    currentDate.getFullYear() === parsedYear
                  )
                })
  
                return <div key={index} className='calendar-item-container' onClick={(e) => {
                  e.stopPropagation()
                  if(dayEvents.length >= 3) {
                    alert('The maximum allowable number of events per day is only 3.')
                    return
                  }
  
                  const temp = new Date(currentDate)
                  temp.setDate(element)
                  setSelectedDate(temp)
                  setIsModalVisible(true)
                }}>
                  <div>{element}</div>
                  <div className="calendar-event-container">
                    {
                      dayEvents.map((element) => {
                        const id = element.id
                        const name = element.data.name
                        const color = element.data.color
  
                        return (
                          <div key={id} className="calendar-event-item" style={{ backgroundColor: color }} onClick={(e) => {
                            e.stopPropagation()
                            const temp = new Date(currentDate)
                            temp.setDate(element)
                            setSelectedDate(temp)
                            setSelectedId(id)
                            setIsModalVisible(true)
                          }}>
                            {name}
                          </div>
                        )
                      })
                    }
                    
                  </div>
                </div>
              })
            }
          </div>
        </div>
        <EventModal
          isModalVisible={isModalVisible}
          selectedId={selectedId}
          selectedDate={selectedDate}
          closeModal={onCloseModal}
        />
      </div>
    );
}

export default Home