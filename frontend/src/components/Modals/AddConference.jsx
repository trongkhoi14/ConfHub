import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Image, Modal, Carousel, CarouselItem } from 'react-bootstrap'
import AddButtonIcon from './../../assets/imgs/edit.png'
import ChooseFORs from '../PostConference/ChooseFORs';
import data from './../Filter/options.json'
import usePost from '../../hooks/usePost';
import useAccordionDates from '../../hooks/useAccordionDates';
import AccordionDates from '../PostConference/AccordionDates';
import SuccessfulModal from './SuccessModal';
import LocationInput from '../PostConference/LocationInput';

const AddConference = ({ show, handleClose, handleCheckStatus, onReloadList }) => {
    const {postConference, getPostedConferences} = usePost()
    const { items, dateListByRound, mergeDatesByRound, addDateToRound, addItem, deleteItem } = useAccordionDates()
    const [page, setPage] = useState(0)
    const [isPosted, setIsPosted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(false)
    const [error, setError] = useState(false)
    const [statusPost, setstatusPost] =useState(false)
    const [formData, setFormData] = useState({
        conf_name: '',
        acronym: '',
        callForPaper: '',
        link: '',
        rank: '',
        fieldsOfResearch: [],
        organizations: [{
            name: '',
            start_date: '',
            end_date: '',
            type: '',
            location: '',
        }],
        importantDates: [],
    });

    const [requiredFields, setRequiredFields] = useState({
        conf_name: true,
        acronym: true,
        callForPaper: true,
        link: true,
        fieldsOfResearch: true,

    });


    const handleImportantDatesChange = (round, date) => {
        console.log('paretn', {round, date})
        addDateToRound(round, date)
    }

    const [selectedfieldsOfResearch, setSelectedfieldsOfResearch] = useState([]);


    const handlefieldsOfResearchChange = (selectedOption) => {
        setSelectedfieldsOfResearch(selectedOption);
        const selectedValues = selectedOption.map(option =>
            (option.value)
        );

        // Cập nhật formData với giá trị mới
        setFormData({
            ...formData,
            fieldsOfResearch: selectedValues,
        });

    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

    };

    const handleorganizationsChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            organizations: prevState.organizations.map((org) => ({
                ...org,
                [name]: value,
            })),
        }))
        if (name === 'startDate') {
            // Ẩn các ngày trước hoặc bằng ngày start date đã chọn trên end date
            document.getElementById('endDate').min = value;
        } else if (name === 'endDate') {
            // Ẩn các ngày sau hoặc bằng ngày end date đã chọn trên start date
            document.getElementById('startDate').max = value;
        }
    };
    const handleLocationChange = (value) => {
        setFormData((prevState) => ({
            ...prevState,
            organizations: prevState.organizations.map((org) => ({
                ...org,
                location: value,
            })),
        }))
    }
    const handleDatesUpdate = () => {
        const merged = mergeDatesByRound()
        console.log({merged})
        setFormData(prevFormData => ({
            ...prevFormData,
            importantDates: merged,
        }));
        return merged
    }

    const handleClearForm = () => {

        setRequiredFields({
            conf_name: true,
            acronym: true,
            callForPaper: true,
            link: true,
            fieldsOfResearch: true,
        })

        setSelectedfieldsOfResearch([])
    }

    const handleCloseForm = () => {
        handleClose()
        handleClearForm()
        setPage(0)
    }
    const handleFormSubmit = async () => {
        const importants = await handleDatesUpdate()
        console.log({importants})
        let allValid = true
        for (const field in requiredFields) {
            if (formData[field] === '' || formData[field] === undefined || (field === 'fieldsOfResearch' && formData[field].length === 0)) {
                allValid = false;
                console.log('allvalid', allValid)
                requiredFields[field] = false

            } else {
                requiredFields[field] = true
            }
        }
        if (allValid) {
            setLoading(true)
            setIsPosted(true)
            
            const {status, message} = await postConference(formData)            
            setLoading(false)
            console.log({status, formData})
            setMessage(message)
            setstatusPost(status)
            if (status) {
                handleCheckStatus(true, message)
                onReloadList()                
                handleCloseForm()
            } else {
                setError(true)
                }
              
            }

        else {
            setRequiredFields(requiredFields)
            setPage(0)
        }
    }
    const handleSelect = (selectedIndex) => {
        setPage(selectedIndex);
    };
    return (
        <>
            <Modal
                show={show}
                onHide={handleCloseForm}
                size="lg"
                scrollable

            >
                <Modal.Header closeButton className='fixed'>
                    <Modal.Title className="text-center w-100 fw-bold text-color-black">Conference Information</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-scrollable-content m-0"
                    style={{ minHeight: '400px', maxHeight: '80vh' }}>

                    {isPosted && statusPost && <SuccessfulModal handleCloseForm={handleClose} message={message}/>}
                    <Form className='px-5'>
                        <div className="modal-scrollable-body">
                            <Carousel activeIndex={page} onSelect={handleSelect} controls={false} interval={null} indicators={false}>
                                <Carousel.Item>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">
                                            <span className='text-danger'>* </span>Conference name:
                                        </Form.Label>
                                        <Form.Control

                                            type="text"
                                            placeholder="Enter the conference/journal name..."
                                            name="conf_name"
                                            value={formData.conf_name}
                                            onChange={handleInputChange}
                                            className={requiredFields.conf_name ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">
                                            <span className='text-danger'>* </span>Acronym:
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter the acronym"
                                            name="acronym"
                                            value={formData.acronym}
                                            onChange={handleInputChange}
                                            className={requiredFields.acronym ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">
                                            <span className='text-danger'>* </span> Link:
                                        </Form.Label>
                                        <Form.Control
                                            name="link"
                                            value={formData.link}
                                            onChange={handleInputChange}
                                            placeholder="Enter link..."
                                            className={requiredFields.link ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-start">
                                        <Form.Label column sm="3">
                                            <span className='text-danger'>* </span> Field of Research:
                                        </Form.Label>
                                        <Col sm="9">
                                            <ChooseFORs
                                                selectedOptions={selectedfieldsOfResearch}
                                                onChange={handlefieldsOfResearchChange}
                                                requiredFields={requiredFields}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">
                                            Rank:
                                        </Form.Label>
                                        <Form.Select
                                            name="rank"
                                            value={formData.rank}
                                            onChange={handleInputChange}
                                            className='border-blue-normal'
                                        >
                                            <option value="N/A">Select rank...</option>
                                            {
                                                data.rank.map((r) => (
                                                    <option value={r.value} key={r.value}>{r.label}</option>

                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>

                                </Carousel.Item>
                                <Carousel.Item>

                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">Organizations type:</Form.Label>
                                        <Form.Select
                                            type="text"
                                            name="type"
                                            value={formData.organizations[0]?.type || ''}
                                            onChange={handleorganizationsChange}

                                        >
                                            <option value="">Select organization type...</option>
                                            {
                                                data.type.map((r) => (
                                                    <option value={r.value} key={r.value}>{r.label}</option>

                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">Organizations name:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.organizations[0]?.name || ''}
                                            onChange={handleorganizationsChange}
                                            placeholder='Enter organization name'
                                        >
                                        </Form.Control>
                                    </Form.Group>
                                    <LocationInput onLocationChange={handleLocationChange} />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <AccordionDates
                                        items={items}
                                        formData={formData}
                                        onChangeImportantDates={handleImportantDatesChange}
                                        onChangeOrganizations={handleorganizationsChange}
                                        onAddItem={addItem}
                                        onDeleteItem={deleteItem}
                                    />

                                </Carousel.Item>
                                <CarouselItem>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-start">
                                        <Form.Label column sm="3">Call for paper:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={14}
                                            name="callForPaper"
                                            value={formData.callForPaper}
                                            onChange={handleInputChange}
                                            placeholder="Enter callForPaper..."
                                            className={requiredFields.callForPaper ? 'border-blue-normal' : 'border border-danger '}
                                        />
                                    </Form.Group>
                                </CarouselItem>
                            </Carousel>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex align-items-center justify-content-center text-white">
                    <Button
                        onClick={() => setPage((prevIndex) => prevIndex - 1)}
                        disabled={page === 0}
                        className='border-blue-normal text-blue-normal bg-transparent text-black  px-5 mx-3'>
                        Back
                    </Button>
                    {
                        page < 3
                            ?
                            <Button onClick={() => setPage((prevIndex) => prevIndex + 1)} className='bg-blue-normal px-5 mx-3 text-black'>
                                Next
                            </Button>
                            :
                            <Button onClick={handleFormSubmit} className='bg-blue-normal px-4 mx-3'>
                                <Image width={20} height={20} className='me-2' src={AddButtonIcon} />
                                Submit
                            </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddConference