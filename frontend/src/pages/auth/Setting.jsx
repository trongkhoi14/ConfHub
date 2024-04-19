import React, { useState } from 'react'
import { Container, Form, Row, Col } from 'react-bootstrap'
import Conference from './../../components/Conference'

const settings = [
  {id: '1', label: 'Extend date', describe: "Conference data will be updated periodically", value: true},
  {id: '2', label: 'Changes and update', describe: "Our system will send you email notifications about conferences with extended dates", value: true},
  {id: '3', label: 'Upcoming events', describe: "Our system will send you email notifications about upcoming events", value: true},
  {id: '4', label: 'Cancelled events', describe: "Our system will send you email notifications about cancelled events", value: true},
  {id: '5', label: 'Your upcoming events', describe: "Our system will send you email notifications about your upcoming events in the timestamp", value: true},
]

const updateCircle = [
  {id: '1', option: "Every 3 days"},
  {id: '2', option: "Everyday"},
  {id: '3', option: "Every 5 days"},
  {id: '4', option: "Every one week"},
]
const Setting = () => {
  const [notificationSettings, setNotificationSettings] = useState(settings);

  const handleCheckboxChange = (id) => {
    const updatedSettings = notificationSettings.map(setting =>
      setting.id === id ? { ...setting, value: !setting.value } : setting
    );
    setNotificationSettings(updatedSettings);
  };

  const updateCircleOptions = [
    { id: '1', option: "Every 3 days" },
    { id: '2', option: "Everyday" },
    { id: '3', option: "Every 5 days" },
    { id: '4', option: "Every one week" },
  ];

  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };
  return (
    <Container
      fluid
      className='pt-5 overflow-hidden' style={{marginLeft: "350px", marginTop: "60px" }}>
      <h4 className=''>Setting</h4>
      <h6 className='text-color-darker mb-2'>How would you like to recieve notifications?</h6>
      
      <Form.Group  className="w-100 mb-2 ps-3 pe-5 d-flex align-items-center justify-content-space">
        <Form.Label column sm="6" className='pe-5 me-5'>
            <div className='fw-bold text-color-black'>Data update circle</div>
            <div className="text-color-medium">Conference data will be updated periodically</div>
        </Form.Label>
        <Form.Select
                onChange={handleSelectChange}
                value={selectedOption}
                style={{ width: '200px' }}
              >
                <option value="">Select an option</option>
                {updateCircleOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.option}
                  </option>
                ))}
              </Form.Select>
      </Form.Group>
      {settings ? 
      <>
        {settings.map(setting=>(
          <Form.Group as={Row} key={setting.id} className="w-100 mb-2 ps-3 pe-5 ">
            <Form.Label column sm="5" className='pe-5 me-5'>
                <div className='fw-bold text-color-black'>{setting.label}</div>
                <div className="text-color-medium">{setting.describe}</div>
            </Form.Label>
            <Col sm="2" className='mt-2 d-flex text-center justify-content-end'>
              <Form.Switch // prettier-ignore
                type="switch"
                id="custom-switch"
                className={`custom-checkbox ${setting.value ? 'checked' : ''}`}
                onChange={() => handleCheckboxChange(setting.id)}
              />
            </Col>
        </Form.Group>
        ))}
      </>
      :
      null
      }
    </Container>
  )
}

export default Setting