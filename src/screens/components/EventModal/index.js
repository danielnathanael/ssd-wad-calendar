import React, { useEffect, useMemo, useState } from 'react'
import ReactModal from "react-modal"
import { FaXmark } from 'react-icons/fa6'
import { getTimeInterval } from '../../../utilities/time'
import EventService from '../../../services/EventService'
import './style.css'

function EventModal ({
    isModalVisible,
    closeModal,
    selectedId,
    selectedDate,
}) {
    const service = EventService()
    const timeArray = useMemo(() => {
        return getTimeInterval()
    }, [])
    const title = selectedId ? "Update Event" : "Create New Event"

    const [name, setName] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [participant, setParticipant] = useState('')

    useEffect(() => {
        if(selectedId) {
            const selectedEvent = service.getEvent(selectedId)
            setName(selectedEvent.name)
            setStartTime(selectedEvent.startTime)
            setEndTime(selectedEvent.endTime)
            setParticipant(selectedEvent.participant)
        }

        return () => clearData()
    }, [selectedId])

    const clearData = () => {
        setName('')
        setStartTime('')
        setEndTime('')
        setParticipant('')
    }

    const onRemove = () => {
        service.removeEvent(selectedId)
        alert('Event removed!')
        clearData()
        closeModal()
    }

    const onSave = () => {
        if(name === null || name === '') {
            alert('Name cannot be empty.')
        } else if(startTime === null || startTime === '') {
            alert('Start Time cannot be empty.')
        } else if(endTime === null || endTime === '') {
            alert('End Time cannot be empty.')
        } else if(participant === null || participant === '') {
            alert('Participant cannot be empty.')
        } else {
            if(selectedId) {
                service.updateEvent(selectedId, selectedDate, name, startTime, endTime, participant)
                alert('Event updated!')
            } else {
                service.addEvent(selectedDate, name, startTime, endTime, participant)
                alert('Event added!')
            }
            clearData()
            closeModal()
        }
    }

    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={isModalVisible}
            onRequestClose={closeModal}
            style={{
            overlay: {
                backgroundColor: 'rgba(255, 255, 255, 0.5)'
            },
            content: {
                maxWidth: '300px',
                maxHeight: '300px',
                margin: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
            }
            }}
        >
            <div className="modal-top-container">
                <div>{title}</div>
                <button className="top-button" onClick={closeModal}>
                    <FaXmark />
                </button>
            </div>
            <div className="form-container">
                <div className="form-section">
                    <div className="form-section-title">Name</div>
                    <input type='text' className='form-section-input' value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="form-section">
                    <div className="form-section-title">Time</div>
                    <div className="form-time-container">
                        <select className="form-time-start form-section-input" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                            <option>-</option>
                            {
                                timeArray.map((element, index) => <option key={index}>{element}</option>)
                            }
                        </select>
                        <span>-</span>
                        <select className="form-time-end form-section-input" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                            <option>-</option>
                            {
                                timeArray.map((element, index) => <option key={index}>{element}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="form-section">
                    <div className="form-section-title">Participants</div>
                    <input type='email' placeholder='john@example.com' className='form-section-input' value={participant} onChange={(e) => setParticipant(e.target.value)} />
                </div>
            </div>
            <div className="modal-bottom-container">
                {
                    selectedId && <button className="form-submit modal-bottom-item" onClick={onRemove}>Remove</button>
                }
                <button className="form-submit modal-bottom-item" onClick={onSave}>Save</button>
            </div>
        </ReactModal>
    )
}

export default React.memo(EventModal)