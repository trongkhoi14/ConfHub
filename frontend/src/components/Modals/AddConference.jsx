import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Image, Modal, Row, Carousel } from 'react-bootstrap'
import AddButtonIcon from './../../assets/imgs/edit.png'
import ChooseFORs from '../ChooseFORs';
import data from './../Filter/options.json'
import usePost from '../../hooks/usePost';
const useImportantDateInput = (initialValue) => {
    const [dates, setDates] = useState(initialValue);

    const handleChange = (index, key, value) => {
        const updatedDates = [...dates];
        updatedDates[index][key] = value;
        setDates(updatedDates);
    };

    return { dates, handleChange };
};

const AddConference = ({ show, handleClose }) => {
    const { postConference } = usePost()
    const [page, setPage] = useState(0)
    const [formData, setFormData] = useState({
        conf_name: '',
        acronym: '',
        content: '',
        link: '',
        rating: '',
        rank: '',
        source_name: 'CORE2024',
        fieldOfResearch: [],
        organization: {
            conf_date: '',
            type: '',
            location: '',
        },
        important_date: [],
    });

    const [requiredFields, setRequiredFields] = useState({
        conf_name: true,
        acronym: true,
        content: true,
        link: true,
        rating: true,
        rank: true,
        source_name: true,
        organization: {
            type: true,
            location: true,
            conf_date: true,
        },
        fieldOfResearch: true,
        important_date: [
            { date_type: 'sub', date_value: true },
            { date_type: 'cmr', date_value: true },
            { date_type: 'reg', date_value: true },
            { date_type: 'noti', date_value: true },
        ],
    });
    const [isInput, setIsInput] = useState(false)

    const [importantDates, setImportantDates] = useState([
        { date_type: 'sub', date_value: '' },
        { date_type: 'cmr', date_value: '' },
        { date_type: 'reg', date_value: '' },
        { date_type: 'noti', date_value: '' },
    ]);

    const { dates, handleChange } = useImportantDateInput(importantDates);

    const handleDateChange = (index, key) => (e) => {
        const { value } = e.target;
        handleChange(index, key, value);
        
    };

    const handleImportantDateUpdate = () => {
        const formDataUpdated = {
            ...formData,
            important_date: dates,
        };
        setFormData(formDataUpdated);
    };
    useEffect(()=>{
        handleImportantDateUpdate()
    }, [dates])

    const [selectedFieldOfResearch, setSelectedFieldOfResearch] = useState([]);


    const handleFieldOfResearchChange = (selectedOption) => {
        setSelectedFieldOfResearch(selectedOption);
        const selectedValues = selectedOption.map(option =>
        ({
            for_name: option.value
        })
        );
        // Cập nhật formData với giá trị mới
        setFormData({
            ...formData,
            fieldOfResearch: selectedValues,
        });
        
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
    };

    const handleOrganizationChange = (event) => {
        const { name, value } = event.target;
        console.log({ name, value })
        // Cập nhật giá trị cho trường tương ứng
        setFormData((prevState) => ({
            ...prevState,
            organization: {
                ...prevState.organization,
                [name]: value,
            },
        }));
        
    };

    const handleClearForm = () => {
        setFormData({
            conf_name: '',
            acronym: '',
            content: '',
            link: '',
            rating: '',
            rank: '',
            source_name: '',
            fieldOfResearch: [],
            organization: {
                conf_date: '',
                type: '',
                location: '',
            },
            important_date: [],
        });
        setRequiredFields({
            conf_name: true,
            acronym: true,
            content: true,
            link: true,
            rating: true,
            rank: true,
            source_name: true,
            organization: {
                type: true,
                location: true,
                conf_date: true,
            },
            fieldOfResearch: true,
            important_date: [
                { date_type: 'sub', date_value: true },
                { date_type: 'cmr', date_value: true },
                { date_type: 'reg', date_value: true },
                { date_type: 'noti', date_value: true },
            ],
        })
        
        setSelectedFieldOfResearch([])
    }
    const handleFormSubmit = () => {
        handleImportantDateUpdate()

        // Kiểm tra các trường cần thiết
        const missingFields = {};
        let formIsValid = true;

       // Kiểm tra các trường cần thiết cho formData
for (const key in formData) {
    if (key !== 'organization' && key !== 'source_name') {
        if (!formData[key] && formData[key] === '') {
            missingFields[key] = false;
            formIsValid = false;
        }
        else {
            missingFields[key] = true;
        }
    } 
    else if (key === 'important_date') {
        for (const date in formData.important_date) {
            if(date.date_value && date.date_value !== '') {
                missingFields.important_date.date_value = false
                formIsValid = false
            }
            else {
                missingFields.important_date.date_value = true
            }
        }
    }
    else {
        for (const orgKey in formData.organization) {
            if (!formData.organization[orgKey] && formData.organization[orgKey] === '') {
                missingFields.organization = { ...missingFields.organization, [orgKey]: false };
                formIsValid = false;
            }
            else missingFields.organization = { ...missingFields.organization, [orgKey]: true };
        }
    }
}
        // Nếu có trường nào thiếu, cập nhật state để đánh dấu chúng
        setRequiredFields({ ...requiredFields, ...missingFields });
        // Sau khi xử lý xong, có thể reset giá trị trong state
        
        console.log(missingFields)
        if(formIsValid){
            console.log(formData)
            postConference(formData)
            handleClose()
            
            

        }
    };

    const handleSelect = (selectedIndex) => {
        setPage(selectedIndex);
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
                <Modal.Body className="modal-scrollable-content"
                    style={{ minHeight: "520px" }}>

                    <Form className='px-5'>
                        <div className="modal-scrollable-body">
                            <Carousel activeIndex={page} onSelect={handleSelect} controls={false} interval={null} indicators={false}>
                                <Carousel.Item>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">
                                            Conference/Journal Name:
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
                                            Acronym:
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
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-start">
                                        <Form.Label column sm="3">Content:</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={7}
                                            name="content"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            placeholder="Enter content..."
                                            className={requiredFields.content ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">Link:</Form.Label>
                                        <Form.Control
                                            name="link"
                                            value={formData.link}
                                            onChange={handleInputChange}
                                            placeholder="Enter link..."
                                            className={requiredFields.link ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">
                                            Rank:
                                        </Form.Label>
                                        <Form.Select
                                            name="rank"
                                            value={formData.rank}
                                            onChange={handleInputChange}
                                            className={requiredFields.conf_name ? 'border-blue-normal' : 'border border-danger '}
                                        >
                                            <option value="N/A">Select rank...</option>
                                            {
                                                data.rank.map((r) => (
                                                    <option value={r.value} key={r.value}>{r.label}</option>

                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-start">
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
                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">
                                            Average Rating:
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter the average rating..."
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            className={requiredFields.rating ? 'border-blue-normal' : 'border border-danger '}
                                        />
                                    </Form.Group>
                                </Carousel.Item>
                                <Carousel.Item>

                                    {dates.map((date, index) => (
                                        <Form.Group as={Col} key={index} className="mb-3 d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                {date.date_type === 'sub' && 'Submission Date:'}
                                                {date.date_type === 'cmr' && 'Camera Ready Date:'}
                                                {date.date_type === 'reg' && 'Registration Date:'}
                                                {date.date_type === 'noti' && 'Notification Date:'}
                                            </Form.Label>
                                            <Form.Control
                                                placeholder="Select date..."
                                                type="date"
                                                value={date.date_value}
                                                onChange={handleDateChange(index, 'date_value')}
                                                className={
                                                    requiredFields.important_date &&
                                                    (date.date_value === '' || date.date_value === null)
                                                        ? 'border border-danger'
                                                        : 'border-blue-normal'
                                                }
                                            />
                                        </Form.Group>
                                    ))}

                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">Conference date:</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="conf_date"
                                            value={formData.organization?.conf_date || ''} 
                                            onChange={handleOrganizationChange}
                                            placeholder="Select conference date..."
                                            className={requiredFields.organization.conf_date ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                        <Form.Label column sm="3">Organization type:</Form.Label>
                                        <Form.Select
                                            type="text"
                                            name="type"
                                            value={formData.organization?.type || ''} 
                                            onChange={handleOrganizationChange}
                                            className={requiredFields.organization.type ? 'border-blue-normal' : 'border border-danger '}
                                            
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
                                        <Form.Label column sm="3">
                                            Location:
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter the location..."
                                            name="location"
                                            value={formData.organization?.location || ''} 
                                            onChange={handleOrganizationChange}
                                            className={requiredFields.organization.location ? 'border-blue-normal' : 'border border-danger '}
                                            required
                                        />
                                    </Form.Group>
                                </Carousel.Item>
                            </Carousel>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex align-items-center justify-content-center text-white">
                    <Button
                        onClick={() => setPage((prevIndex) => prevIndex - 1)}
                        disabled={page === 0}
                        className='border-blue-normal text-blue-normal bg-transparent text  px-5 mx-3'>

                        Back
                    </Button>
                    {
                        page === 0
                            ?
                            <Button onClick={() => setPage((prevIndex) => prevIndex + 1)} className='bg-blue-normal px-5 mx-3'>
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