import Reac, {useState} from 'react'
import { Dropdown, InputGroup, Form,ButtonGroup, Button, Image } from 'react-bootstrap'

import useFilter from '../../hooks/useFilter'

import starIcon from '../../assets/imgs/star.png'
import unstarIcon from '../../assets/imgs/unstar.png'
const rating = [1,2,3,4,5]
const StarDropdown = ({label}) => {
    const { filterOptions, addKeywords, sendFilter } = useFilter()
    const [selectedOptions, setSelectedOptions] = useState([]);
    
    const [isOpenDropdown, setOpenDropdown] = useState(false)

    const handleShowDropDown = () => {
        setOpenDropdown(!isOpenDropdown)
    }
    const handleDropdownToggle = (isOpen) => {
        setOpenDropdown(isOpen);
      };
    
      const handleDropdownHide = () => {
        setOpenDropdown(false);
      };
    const handleOptionChange = (item) => {
        
        const option = `${label} from ${item}*`
        console.log(option)
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((selectedItem) => selectedItem !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };
    const handleApplyFilter = () => {
        addKeywords(label, selectedOptions)
        setOpenDropdown(!isOpenDropdown)
        sendFilter(label,selectedOptions )
    }
    return (
        <Dropdown className="w-100" show={isOpenDropdown} onToggle={handleDropdownToggle} onHide={handleDropdownHide} 
            style={{zIndex: '1'}}
        >
            <Dropdown.Toggle
                onClick={() => handleShowDropDown()}
                className="w-100 d-flex justify-content-between align-items-center bg-white border-1 text-color-medium  border-dark-subtle">
                All
            </Dropdown.Toggle>
            <Dropdown.Menu className='shadow-sm py-0'>
                <Form className=' overflow-y-auto' style={{ maxHeight: "180px" }}>
                    {
                        rating.map((star) => (
                            <div className='w-100 p-2' key={star}>
                                <Form.Check
                                    key={star}
                                    type="checkbox"
                                    label={
                                        <div className=' d-flex align-items-center'>
                                        {Array.from({length: star}, (_, index)=>(
                                            <Image
                                                key={index}
                                                src={starIcon}
                                                width={15} height={15}
                                                className='me-1'
                                            />
                                        ))}
                                        {Array.from({length: 5-star}, (_, index)=>(
                                            <Image
                                                key={index}
                                                src={unstarIcon}
                                                width={15} height={15}
                                                className='me-1'
                                            />
                                        ))}
                                        </div>
                                    }
                                    checked={selectedOptions.includes(`${label} from ${star}*`)}
                                    onChange={() => handleOptionChange(star)}
                                />
                            </div>
                        ))
                    }
                </Form>
                <Dropdown.Divider />
                <ButtonGroup className='sticky-bottom w-100 bg-white px-2 pb-2'>
                    <Button
                        onClick={handleShowDropDown}
                        className='w-50 me-2 rounded-2 border-0 bg-secondary'>
                        Cancel
                    </Button>
                    <Button className='w-50 rounded-2 border-0 bg-primary-normal' onClick={handleApplyFilter}>
                        Apply
                    </Button>
                </ButtonGroup>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default StarDropdown