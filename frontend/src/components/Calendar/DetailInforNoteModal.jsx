import React from 'react'
import { useState } from 'react'
import { Form, Row } from 'react-bootstrap'
import { Button, ButtonGroup } from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import useNote from '../../hooks/useNote'
import { FormGroup } from 'react-bootstrap'
import DeleteModal from '../Modals/DeleteModal'
import Loading from '../Loading'
import { useEffect } from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faLocation, faLocationPin } from '@fortawesome/free-solid-svg-icons'

const DetailInforNoteModal = ({ show, onClose, note, onDelete, onUpdate, onReloadList, onBack }) => {

    const [isUpdate, setIsUpdate] = useState(false)
    const [warning, setWarning] = useState('')
    const [isInput, setIsInput] = useState(false)
    const [inputvalue, setInputValue] = useState('');
    const [autoClose, setAutoCLose] = useState(3)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [isInputUpdate, setIsInputUpdate] = useState(false)

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(false)
    const [error, setError] = useState(false)
    const [statusUpdate, setStatusUpdate] = useState(false)

    useEffect(() => {
        if (statusUpdate) {

            const timer = setInterval(() => {
                setAutoCLose(prevCountdown => prevCountdown - 1);
            }, 1000);

            // Đóng modal sau 5 giây
            setTimeout(() => {
                onClose()
                setAutoCLose(4); // Reset thời gian đếm ngược
            }, 3000);

            // Hủy bỏ timer khi component unmount
            return () => {
                clearInterval(timer);
            };
        }
    }, [statusUpdate]);

    const handleChooseUpdate = () => {
        setIsInputUpdate(!isInputUpdate)
        setWarning('')
    }
    const handleInputChange = (val) => {
        setInputValue(val)
    }
    const handleUpdate = async () => {
        try {
            if (inputvalue !== '') {
                const id = note.id
                setLoading(true)
                setIsUpdate(true)
                setWarning('')
                const { status, message } = await onUpdate(id, inputvalue)
                if (status) {
                    setIsInputUpdate(false)
                    setStatusUpdate(status)
                    setMessage(message)
                    setLoading(false)
                    onReloadList()
                }
                else {
                    setMessage(message)
                    setError(true)
                    setInputValue('')
                }
            }
            else setWarning('You should input something!')

        } catch (error) {
            console.error('Error:', error);

        }
    }

    const checkRenderEnddate = (start, end) => {
        return end !== null && start !== null && start !== end
    }
    const handleDelete = async () => {
        try {
            setIsUpdate(true)
            const { status, message } = await onDelete(note.id);
            if (status) {
                onReloadList()
                onClose()
            }
            else {
                setMessage(message)
                setError(true)
                setStatusUpdate(false)
                setIsUpdate(false)
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>

            </Modal.Header>
            <Modal.Body>
                <p className="text-teal-dark fw-bold fs-4 my-3">
                    {note.date_type}
                </p>
                {
                    isInputUpdate ?
                        <>
                            <Form onSubmit={handleUpdate}>
                                <Form.Group className='d-flex align-items-center'>
                                    <Form.Label>Note:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={note.note}
                                        value={inputvalue}
                                        onChange={(event) => handleInputChange(event.target.value)}
                                        className='border-0 border-bottom ms-3 p-1'
                                        autoFocus={true}
                                    />
                                </Form.Group>


                            </Form>
                        </>
                        :
                        <div className="my-3 fs-5">
                            <span className="text-color-medium ">{note.subStyle === 'note-event' ? `Your note: ` : `Conference note: `}</span>
                            <span className='fw-semibold'>{note.note}</span>
                        </div>
                }
                {
                    note.subStyle !== 'note-event' && <p className='text-color-black my-3'>
                        <FontAwesomeIcon icon={faLocationPin} className='text-teal-normal me-2' />
                        {` ${note.location}`}

                    </p>
                }
                <p className='text-color-black my-3 fs-5'>
                    <FontAwesomeIcon icon={faCalendar} className='text-skyblue-dark me-3'/>
                    {checkRenderEnddate(note.start_date, note.end_date) ?
                        <>
                            
                                <span className="text-color-black fw-semibold">
                                    {moment(note.start_date).format('ddd, MM/DD/YYYY')}
                                </span>
                                <span>{` to `}</span>
                                <span className="text-color-black fw-semibold">
                                    {moment(note.end_date).format('ddd, MM/DD/YYYY')}
                                </span>
                        </>
                        :
                        <>
                            {
                                note.start_date !== null
                                &&
                                    <span className="text-color-black fw-semibold">
                                        {moment(note.start_date).format('dddd, MM/DD/YYYY')}
                                    </span>
                            }
                        </>
                    }


                </p>

                {
                    showConfirmDelete &&
                    <DeleteModal
                        show={showConfirmDelete}
                        onClose={() => setShowConfirmDelete(false)}
                        onConfirm={handleDelete}
                        message={'note'}
                    />
                }
            </Modal.Body>
            <Modal.Footer>
                {warning !== '' && <p className="text-warning text-center">{warning}</p>}
                {error && <p className="text-danger text-center">{message}</p>}
                {!error && isUpdate && <p className="text-success text-center">{message}</p>}
                <ButtonGroup className='w-100'>
                    {
                        isInputUpdate ?
                            <>
                                <Button className='bg-secondary border-light ms-1 rounded' onClick={handleChooseUpdate}>
                                    Cancel
                                </Button>

                                <Button className='bg-primary-normal border-light ms-1 rounded' onClick={handleUpdate}>
                                    {loading ? <Loading onReload={handleUpdate} /> : 'Update'}
                                </Button>
                            </>
                            :
                            <>
                                <Button className='bg-red-normal border-light me-1 rounded' onClick={() => setShowConfirmDelete(true)}>
                                    Delete
                                </Button>
                                <Button className='bg-skyblue-dark border-light ms-1 rounded' onClick={handleChooseUpdate}>
                                    Update
                                </Button>
                            </>
                    }
                </ButtonGroup>
                {isUpdate && statusUpdate && <p>Auto closing in {autoClose} seconds</p>}
            </Modal.Footer>

        </Modal>
    )
}

export default DetailInforNoteModal