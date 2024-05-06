import React, { useEffect, useState } from 'react';
import { Accordion, Button, Card, Col, Form } from 'react-bootstrap';
import CustomAccordionDates from './CustomAccordionDates';
import useAccordionDates from '../hooks/useAccordionDates';
import InputImportantDates from './InputImportantDates';
import useFormDataInput from '../hooks/useFormDataInput';

const AccordionDates = ({formData, onChangeImportantDates, onChangeOrganizations}) => {
    const { items, addItem, toggleItem, openItemIndex } = useAccordionDates([
        { id: 1, title: 'Round 1', content: 'Content 1' },
    ])

    const { dateListByRound, addDateToRound} = useFormDataInput()

    return (
        <Accordion defaultActiveKey="1" className='h-100'>
            {items.map((item, index) => (
                <Card key={item.id} className='border-0'>
                    {/* Render CustomToggle cho mỗi item */}
                    {items.length > 1 && (
                        <CustomAccordionDates
                            eventKey={item.id}
                            onClick={() => toggleItem(item.id)}
                        >
                            {item.title}
                        </CustomAccordionDates>
                    )}
                    <Accordion.Collapse eventKey={item.id} in={openItemIndex === item.id}>
                        <Card.Body>
                            <InputImportantDates 
                                formData={formData}
                                onChange={onChangeImportantDates}
                                round={openItemIndex}
                            />
                            <Form.Group as={Col} className="mb-3 d-flex align-items-center">
                                <Form.Label column sm="3"><span className='text-danger'>* </span>Conference date:</Form.Label>
                                From
                                <Form.Control
                                    type="date"
                                    name="start_date"
                                    value={formData.organizations[0]?.start_date || ''}
                                    onChange={onChangeOrganizations}
                                    placeholder="Select conference start date..."
                                    className="mx-2"
                                />
                                to
                                <Form.Control
                                    type="date"
                                    name="end_date"
                                    value={formData.organizations[0]?.end_date || ''}
                                    onChange={onChangeOrganizations}
                                    placeholder="Select conference start date..."
                                    className="ms-2"
                                />
                            </Form.Group>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            ))}
            
            <Button onClick={addItem} className='mt-4 w-100 text-color-darker bg-primary-light border-primary-normal'>Add round</Button>
        </Accordion>
    );
};

export default AccordionDates;
