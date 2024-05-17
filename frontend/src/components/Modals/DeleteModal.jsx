import { ButtonGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

const DeleteModal = ({show,onClose, onConfirm, message}) => {
    
  return (
    <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          {`Delete ${message}`}
        </Modal.Header>
        <Modal.Body>
            <p className="fs-5 fw-bold">{`Are you sure want to delete this ${message}?`}</p>
            <p>This action is permanent and cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
        <ButtonGroup className='w-100'>
                    <Button className='bg-secondary border-light me-2 rounded' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className='bg-red-normal border-danger ms-2  rounded' onClick={onConfirm}>
                        Delete
                    </Button>
                </ButtonGroup>
        </Modal.Footer>
    
    </Modal>
  )
}

export default DeleteModal