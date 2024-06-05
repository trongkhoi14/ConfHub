import { useEffect, useState } from 'react';
import { Modal, Button, ButtonGroup, Tabs, Tab, Fade, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select'
import usePost from '../../hooks/usePost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCircleXmark, faEdit } from '@fortawesome/free-solid-svg-icons';
import useSearch from '../../hooks/useSearch';
import SuccessfulModal from '../Modals/SuccessModal';
import Loading from '../Loading';
import data from './../Filter/options.json'
import { capitalizeFirstLetter } from '../../utils/formatWord';

const ModalUpdateConf = ({ conference, show, onClose, onUpdatePost }) => {
  const { loading, updatePost } = usePost()
  const [message, setMesage] = useState('')
  const [status, setStatus] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { filterOptions, getOptionsFilter } = useSearch()
  const [isupdateForm, setIsUpdateForm] = useState()
  const [isDuplicate, setIsDuplicate] = useState(false)
  const [tab, setTab] = useState('1')
  const [formData, setFormData] = useState({
    callForPaper: conference.callForPaper || "",
    link: conference.information.link || "",
    rank: conference.information.rank || "N/I",
    fieldsOfResearch: Array.from(new Set(conference.information.fieldOfResearch)) || [],
    organizations: conference.organizations.filter(org => org.status === 'new') // Lọc ra các organizations có status là 'new'
      .map(org => ({
        name: org.name,
        type: org.type,
        location: org.location,
        start_date: org.start_date,
        end_date: org.end_date
      })),

    importantDates: conference.importantDates.filter(date => date.status === 'new') // Lọc ra các importantDates có status là 'new'
      .map(date => ({ date_type: date.date_type, date_value: date.date_value }))
  });

  const [selectedOptions, setSelectedOptions] = useState(Array.from(new Set(conference.information.fieldOfResearch)).map(field => ({
    value: field,
    label: capitalizeFirstLetter(field)
  })));

  useEffect(() => {
    if (!filterOptions['rank'] || !filterOptions['for']) {
      getOptionsFilter('', [])
    }
  }, [filterOptions])

  const handleInformationChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const isEndDateValid = (startDate, endDate) => {
    return new Date(startDate) <= new Date(endDate);
  };
  const handleOrganizationChange = (index, key, value) => {
    const updatedFormData = { ...formData };
    // Sao chép tổ chức cần được cập nhật
    const updatedOrganization = { ...updatedFormData.organizations[index] };
    // Cập nhật giá trị của trường dữ liệu cụ thể
    updatedOrganization[key] = value;
    // Cập nhật tổ chức trong mảng organizations
    updatedFormData.organizations[index] = updatedOrganization;

    if (key === 'end_date') {
      // Kiểm tra nếu end_date không hợp lệ
      if (!isEndDateValid(updatedOrganization.start_date, value)) {
        // Đánh dấu tổ chức này có lỗi
        updatedOrganization.isInvalidEndDate = true;
      } else {
        // Nếu end_date hợp lệ, loại bỏ đánh dấu lỗi
        updatedOrganization.isInvalidEndDate = false;
      }
    }

    updatedFormData.organizations[index] = updatedOrganization;
    setFormData(updatedFormData);
  };



  //important dates
  const handleDateChange = (index, field, value) => {
    const updatedDates = [...formData.importantDates];
    updatedDates[index][field] = value;
    setFormData({ ...formData, importantDates: updatedDates });
  };

  const addDate = () => {
    const newDates = [...formData.importantDates, { date_type: "", date_value: "" }];
    setFormData({ ...formData, importantDates: newDates });
  };

  const removeDate = (index) => {
    const updatedDates = [...formData.importantDates];
    updatedDates.splice(index, 1);
    setFormData({ ...formData, importantDates: updatedDates });
  };

  // Tạo danh sách options từ fieldOfResearch và filterOptions['for']
  const options = [
    ...Array.from(new Set(conference.information.fieldOfResearch)).map(option => ({ value: option, label: option })),
    ...filterOptions['for'].map(option => ({ value: option, label: option }))
  ];

  const handleChangeFieldOfResearch = selectedOptions => {
    setSelectedOptions(selectedOptions);
    setFormData({
      ...formData,
      fieldsOfResearch: selectedOptions.map(option => option.value)
    });
  };

  const handleUpdatePost = async () => {
    setIsUpdateForm(true)

    //kiểm tra location trùng name
    const hasDuplicateNames = formData.organizations.some((org, index) => {
      return formData.organizations.findIndex((item, i) => item.name === org.name && i !== index) !== -1;
    });


    //kiểm tra importantdate trùng date_type
    const seenDateTypes = {};
    const hasDuplicateDateType = formData.importantDates.some(date => {
      if (seenDateTypes[date.date_type]) {
        // Nếu date_type đã xuất hiện trước đó, trả về true
        return true;
      } else {
        // Nếu chưa xuất hiện, đánh dấu là đã xuất hiện
        seenDateTypes[date.date_type] = true;
        return false;
      }
    });
    setIsDuplicate(hasDuplicateNames)
    if (hasDuplicateNames) {
      setErrorMessage('Organization name must be unique!')
      setTab(2)
    }
    else if (hasDuplicateDateType) {
      setErrorMessage('Date type must be unique!')
      setTab(3)
    }
    else {

      const result = await updatePost(formData, conference.id)
      setMesage(result.message)
      setStatus(result.status)
      onUpdatePost()
      if (result.status) {
        setShowSuccessModal(true)
      }

    }

  }

  const handleSelectTab = (selectIndex) => {
    setTab(selectIndex)
  }


  return (
    <Modal show={show} onHide={onClose} size="lg" centered scrollable >
      {status && showSuccessModal && <SuccessfulModal message={message} show={showSuccessModal} handleClose={onClose} />}
      <Modal.Header closeButton>
        <Modal.Title className='text-center w-100 text-skyblue-dark'>Update conference</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: "450px", maxHeight: "700px" }} className='pt-3'>
        <Form>

          <Tabs activeKey={tab} transition={Fade} fill onSelect={handleSelectTab}>

            <Tab eventKey={`1`} title="Information" className='mx-4 pt-5'>
              <Form.Group as={Row} className='my-3'>
                <Form.Label column sm="3">Conference name: </Form.Label>
                <Col>
                  <Form.Control type="text" value={conference.information.name} disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className='my-3'>
                <Form.Label column sm="3">Acronym: </Form.Label>
                <Col>
                  <Form.Control type="text" value={conference.information.acronym} disabled />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className='my-3'>
                <Form.Label column sm="3">Reference link: </Form.Label>
                <Col>
                  <Form.Control type="text" value={formData.link} onChange={(e) => handleInformationChange('link', e.target.value)} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className='my-3'>
                <Form.Label column sm="3">Rank: </Form.Label>
                <Col>
                  <Form.Select
                    className='d-block'
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}>
                    {(filterOptions.rank || data.rank).map((option, index) => (
                      <option value={option.value || option} key={index}>{option.label || option}</option>
                    ))}
                  </Form.Select>

                </Col>
              </Form.Group>


              <Form.Group as={Row} className='my-3'>
                <Form.Label column sm="3">Field of research: </Form.Label>
                <Col>
                  <Select
                    options={options}
                    value={selectedOptions}
                    isMulti
                    onChange={handleChangeFieldOfResearch}
                    menuPosition="fixed"
                  />
                </Col>
              </Form.Group>
            </Tab>

            <Tab eventKey={`2`} title="Organization" className='mx-4'>

              {isDuplicate && <span className='text-warning'>Organization name must be unique!</span>}
              {formData.organizations.map((org, index) => (

                <div key={index} className='mt-5'>

                  <Form.Group as={Row} className='my-3'>
                    <Form.Label column sm="3">Organization name: </Form.Label>
                    <Col>
                      <div className='d-flex align-items-center'>
                        <Form.Control type="text" value={org.name} onChange={(e) => handleOrganizationChange(index, 'name', e.target.value)} />

                        {/*<FontAwesomeIcon icon={faCircleExclamation} className='ms-2 text-warning' title='Organization name must be unique!' />*/}

                      </div>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className='my-3'>
                    <Form.Label column sm="3">Type: </Form.Label>
                    <Col>
                      <Form.Select value={org.type} onChange={(e) => handleOrganizationChange(index, 'type', e.target.value)}>
                        <option value="">Select type...</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className='my-3'>
                    <Form.Label column sm="3">Location: </Form.Label>
                    <Col>
                      <Form.Control type="text" value={org.location} onChange={(e) => handleOrganizationChange(index, 'location', e.target.value)} placeholder='Address, building, state (optional)' />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className='my-3'>
                    <Form.Label column sm="3">Start Date: </Form.Label>
                    <Col>
                      <Form.Control type="date" value={org.start_date} onChange={(e) => handleOrganizationChange(index, 'start_date', e.target.value)} />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className='my-3'>
                    <Form.Label column sm="3">End Date: </Form.Label>
                    <Col>
                      <Form.Control type="date" value={org.end_date} onChange={(e) => handleOrganizationChange(index, 'end_date', e.target.value)} className={org.isInvalidEndDate ? 'border-danger' : ''} />
                    </Col>
                  </Form.Group>
                </div>

              ))}
              {isupdateForm && errorMessage !== '' && <p className='text-center text-warning'>{errorMessage}</p>}
            </Tab>
            <Tab eventKey={`3`} title="Important dates" className='mx-4'>
              <div className='w-100 d-flex justify-content-end'>
                <Button variant="secondary" className="mt-3 text-end bg-skyblue-dark border-0" onClick={addDate}>Add important dates</Button>
              </div>
              {formData.importantDates.map((date, index) => (
                <Form.Group as={Row} key={index} className='my-3 d-flex w-100'>

                  <Col sm='6'>
                    <Form.Label>Date type:</Form.Label>
                    <Form.Control type="text" value={date.date_type} onChange={(e) => handleDateChange(index, 'date_type', e.target.value)} placeholder='Submission date, Notification date...' />
                  </Col>
                  <Col >

                    <Form.Label>Date:</Form.Label>
                    <Form.Control type="date" value={date.date_value} onChange={(e) => handleDateChange(index, 'date_value', e.target.value)} />
                  </Col>
                  <Col sm="1" className='d-flex align-items-end'>
                    <Button variant="danger" onClick={() => removeDate(index)} className='bg-transparent border-0' title='Delete this date'>
                      <FontAwesomeIcon icon={faCircleXmark} className='text-danger' />
                    </Button>
                  </Col>
                </Form.Group>
              ))}
              {isupdateForm && errorMessage !== '' && <p className='text-center text-warning'>{errorMessage}</p>}
            </Tab>
            <Tab eventKey={`4`} title="Call For Paper" className='mx-4'>
              <Form.Group as={Row} className='my-3'>
                <Form.Label column sm="3">Call for paper: </Form.Label>
                <Col>
                  <Form.Control type="text" as="textarea" rows={14} value={formData.callForPaper} onChange={(e) => handleInformationChange('callForPaper', e.target.value)} />
                </Col>
              </Form.Group>
            </Tab>
          </Tabs>
        </Form>
      </Modal.Body>
      {
        isupdateForm && !status && message !== '' && <p className="text-danger text-center">{message}</p>
      }
      <Modal.Footer className='d-flex justify-content-center'>

        <ButtonGroup>
          <Button onClick={onClose} className='bg-secondary border-light px-5 mx-3 rounded text-light'>
            Cancel
          </Button>
          <Button onClick={handleUpdatePost} className='bg-blue-normal border-light px-4 mx-3 rounded d-flex'>
            {
              loading
                ?
                <Loading />
                :
                <div>
                  <FontAwesomeIcon icon={faEdit} className='me-2' />
                  Update
                </div>
            }

          </Button>
        </ButtonGroup>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalUpdateConf;
