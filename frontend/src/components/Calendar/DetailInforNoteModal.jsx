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

const DetailInforNoteModal = ({ show, onClose, note, onDelete, onUpdate, onReloadList, onBack }) => {

    const [isUpdate, setIsUpdate] = useState(false)
    const [warning, setWarning] = useState('')
    const [isInput, setIsInput] = useState(false)
    const [inputvalue, setInputValue] = useState('');
    const [autoClose, setAutoCLose] = useState(3)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(false)
  const [error, setError] = useState(false)
  const [statusUpdate, setStatusUpdate] =useState(false)
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

    const handleInputChange = (val) => {
        setInputValue(val)
        if (inputvalue !== '') {
            setIsInput(true)
        }

    }
    const handleUpdate = async () => {
        try {
            if(inputvalue !== ''){
                const id = note.id
                setLoading(true)
                setIsUpdate(true)
                setWarning('')
                const {status, message} = await onUpdate(id, inputvalue)
                console.log({status, message})
                if (status) {
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
    const handleDelete = async () => {
        try {
            setIsUpdate(true)
            const {status, message} = await onDelete(note.id);
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
                {
                    note ?
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
                                <Form.Group className='d-flex align-items-center my-4'>
                                    <div>Date type: </div>
                                    <div className='ms-3'>{note.date_type}</div>
                                </Form.Group>
                                <Form.Group className='d-flex align-items-center my-4'>
                                    <div>Date: </div>
                                    <div className='ms-5'>
                                        {note.start_date}
                                        
                                            {
                                                note.end_date ? 
                                                <>
                                                {` to ${note.end_date}`}
                                                </>
                                                :
                                                ''
                                            }
                                    </div>
                                </Form.Group>

                            </Form>
                        </>
                        :
                        <Button>
                            Turn back!
                        </Button>
                }

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
                {warning !=='' && <p className="text-warning text-center">{warning}</p>}
                {error&& <p className="text-danger text-center">{message}</p> }
                {!error && isUpdate && <p className="text-success text-center">{message}</p> }
                <ButtonGroup className='w-100'>
                    <Button className='bg-red-normal border-light me-1' onClick={() => setShowConfirmDelete(true)}>
                        Delete
                    </Button>
                    <Button className='bg-primary-normal border-light ms-1' onClick={handleUpdate} disabled={!isInput}>
                        {loading ? <Loading onReload={handleUpdate}/>: 'Update'}
                    </Button>
                </ButtonGroup>
                {isUpdate && statusUpdate && <p>Auto closing in {autoClose} seconds</p>}
            </Modal.Footer>

        </Modal>
    )
}

export default DetailInforNoteModal