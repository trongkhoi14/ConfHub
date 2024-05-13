import React, { useEffect, useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import data from './../Filter/options.json'
const LocationInput = ({ onLocationChange }) => {
    
    const [formData, setFormData] = useState({
        numberStreet: '',
        stateProvince: '',
        city: '',
        country: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        const { numberStreet, stateProvince, city, country } = formData;
        
        const location = `${numberStreet}, ${stateProvince}, ${city}, ${country}`;
        onLocationChange(location);
    };

    return (
        <>
            <Form.Group as={Col} className="mb-3 d-flex align-items-start">
                <Form.Label column sm="3">Address:</Form.Label>
                <Col sm="9">
                    <Form.Control
                        type="text"
                        name="numberStreet"
                        value={formData.numberStreet}
                        onChange={handleInputChange}
                        placeholder="Enter number street..."
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Col} className="mb-3 d-flex align-items-start">
                <Form.Label column sm="3">State/Province:</Form.Label>
                <Col sm="9">
                    <Form.Control
                        type="text"
                        name="stateProvince"
                        value={formData.stateProvince}
                        onChange={handleInputChange}
                        placeholder="Enter state/province..."
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Col} className="mb-3 d-flex align-items-start">
                <Form.Label column sm="3">City:</Form.Label>
                <Col sm="9">
                    <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter city..."
                    />
                </Col>
            </Form.Group>
            <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                <Form.Label column sm="3">Country:</Form.Label>
                <Form.Select
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}

                >
                    <option value="">Select organizations type...</option>
                    {
                        data.location.map((r) => (
                            <option value={r.label} key={r.value}>{r.label}</option>

                        ))
                    }
                </Form.Select>
            </Form.Group>
        </>
    );
};

export default LocationInput;
