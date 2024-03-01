import React, { useState } from 'react'
import { Button, Col, Form, Image, Modal, Row } from 'react-bootstrap'
import AddButtonIcon from './../../assets/imgs/edit.png'
import ChooseFORs from '../ChooseFORs';
const AddConference = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({
        conferenceName: '',
        acronym: '',
        rank: '',
        type: '',
        form: '',
        fieldOfResearch: [],
        averageRating: '',
        submissionDate: '',
        notificationDate: '',
        cameraReadyDate: '',
        conferenceDate: '',
        location: '',
    });
    const [selectedFieldOfResearch, setSelectedFieldOfResearch] = useState([]);

    const handleFieldOfResearchChange = (selectedOptions) => {
        setSelectedFieldOfResearch(selectedOptions);
        const selectedValues = selectedFieldOfResearch.map(option => option.value);

        // Cập nhật formData với giá trị mới
        setFormData({
        ...formData,
        fieldOfResearch: selectedOptions,
        });
        console.log(selectedFieldOfResearch)
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleFormSubmit = () => {
        // Thực hiện các hành động cần thiết với formData
        console.log(formData);

        // Sau khi xử lý xong, có thể reset giá trị trong state
        setFormData({
            conferenceName: '',
            acronym: '',
            rank: '',
            type: '',
            form: '',
            fieldOfResearch: [],
            averageRating: '',
            submissionDate: '',
            notificationDate: '',
            cameraReadyDate: '',
            conferenceDate: '',
            location: '',
        });
        setSelectedFieldOfResearch([])

        handleClose()
    };

    return (
        <>
            <Modal 
                show={show} 
                onHide={handleClose} 
                size="lg"
                scrollable
                >
                <Modal.Header closeButton className='fixed'>
                    <Modal.Title className="text-center w-100 fw-bold text-color-black">Conference Information</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-scrollable-content">

                    <Form className='px-5'>
                        <div className="modal-scrollable-body">
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3">
                                    Conference/Journal Name:
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the conference/journal name..."
                                        name="conferenceName"
                                        value={formData.conferenceName}
                                        onChange={handleInputChange}
                                        className='border-blue-normal'
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3">
                                    Acronym:
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the acronym"
                                        name="acronym"
                                        value={formData.acronym}
                                        onChange={handleInputChange}
                                        className='border-blue-normal'
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3">
                                    Rank:
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the rank..."
                                        name="rank"
                                        value={formData.rank}
                                        onChange={handleInputChange}
                                        className='border-blue-normal'
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3">
                                    Type:
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the type..."
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className='border-blue-normal'
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3">
                                    Form:
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the form..."
                                        name="form"
                                        value={formData.form}
                                        onChange={handleInputChange}
                                        className='border-blue-normal'
                                    />
                                </Col>
                            </Form.Group>
                                <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                    <Form.Label column sm="3">
                                        Field of Research:
                                    </Form.Label>
                                    <Col sm="9">
                                        <ChooseFORs
                                        selectedOptions={selectedFieldOfResearch}
                                        onChange={handleFieldOfResearchChange}
                                        />
                                    </Col>
                                </Form.Group>
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3">
                                    Average Rating:
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the average rating..."
                                        name="averageRating"
                                        value={formData.averageRating}
                                        onChange={handleInputChange}
                                        className='border-blue-normal'
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3">
                                    Submission Date:
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        type="date"
                                        placeholder="Select submission date..."
                                        name="submissionDate"
                                        value={formData.submissionDate}
                                        onChange={handleInputChange}
                                        className='border-blue-normal'
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3">
                                    Notification Date:
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        type="date"
                                        placeholder="Select notification date..."
                                        name="notificationDate"
                                        value={formData.notificationDate}
                                        onChange={handleInputChange}
                                        className='border-blue-normal'
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3">
                                    Camera Ready Date:
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        type="date"
                                        placeholder="Select camera ready date..."
                                        name="cameraReadyDate"
                                        value={formData.cameraReadyDate}
                                        onChange={handleInputChange}
                                        className='border-blue-normal'
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3">
                                    Conference Date:
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        type="date"
                                        placeholder="Select conference date..."
                                        name="conferenceDate"
                                        value={formData.conferenceDate}
                                        onChange={handleInputChange}
                                        className='border-blue-normal'
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3">
                                    Location:
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the location..."
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className='border-blue-normal'
                                    />
                                </Col>
                            </Form.Group>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex align-items-center justify-content-center text-white">
                    <Button variant="primary" onClick={handleFormSubmit} className='bg-blue-normal'>
                        <Image width={20} height={20} className='me-2' src={AddButtonIcon} />
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddConference