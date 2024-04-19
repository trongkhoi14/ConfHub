import Reac, {useEffect, useState} from 'react'
import { Dropdown, InputGroup, Form,ButtonGroup, Button, Image } from 'react-bootstrap'

import useFilter from '../../hooks/useFilter'

import starIcon from '../../assets/imgs/star.png'
import unstarIcon from '../../assets/imgs/unstar.png'

import Select from 'react-select'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import { useLocation } from 'react-router-dom'
const rating = [1,2,3,4,5]
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        border: '1px solid #4EB1A4', // Điều chỉnh màu và độ dày của border khi focus
        borderRadius: '4px', // Điều chỉnh độ cong của góc
        boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(76, 139, 245, 0.25)' : null, // Hiệu ứng boxShadow khi focus
        '&:hover': {
            border: '2px solid #4c8bf5', // Điều chỉnh màu và độ dày của border khi hover
        },
    }),
    option: (provided, state) => ({
        ...provided,
        background: state.isFocused ? 'lightgray !important' : 'white !important',
        color: state.isFocused ? 'black !important' : 'gray !important',
        cursor: 'pointer', // Thay đổi kiểu con trỏ khi hover
      }),
};
const CustomOption = ({ innerProps, label, isSelected }) => {
    const renderStars = (numStars) => {
        const stars = [];
        for (let i = 1; i <= numStars; i++) {
          stars.push(<Image key={i} src={starIcon} width={16} className='mx-1'/>);
        }
        for (let i = numStars + 1; i <= 5; i++) {
          stars.push(<Image key={i} src={unstarIcon} width={16} className='mx-1'/>);
        }
        return stars;
      };
    
      return (
        <div {...innerProps} className='d-flex align-items-start'>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            className='m-2'
          />
          <label style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
            {renderStars(label)}
          </label>
        </div>
      );}

const StarDropdown = ({label}) => {
    const { filterOptions, addKeywords, sendFilter } = useFilter()
    const [tranformOptions, setTranformOptions] = useState([])
    
    const location = useLocation()
    useEffect(() => {
        let transformedState = []
        if (filterOptions !== null) {
            transformedState = rating.map((item, index) => ({
                value: index + 1,
                label: item,
            }));

        }
        setTranformOptions(transformedState);
    }, []);
    const handleOptionChange = (item) => {
        const selectedValues = item.map(option => option.label);
        const formatLabel = capitalizeFirstLetter(label)
        const formatOption = `${formatLabel} from ${selectedValues}*`
        
        if(location.pathname === '/home' || location.pathname === '/') {
          addKeywords('optionsSelected', label, [formatOption])
          sendFilter( label, [selectedValues])
      }
      else {
        addKeywords('filterOptionsAuth', label, [formatOption])
      }
        
    };
    return (
        <div>
            <Select
                styles={customStyles}
                isMulti={true}
                options={tranformOptions}
                value
                components={{ Option: CustomOption }}
                onChange={handleOptionChange}
                closeMenuOnSelect={false}
                placeholder="All"
            />
        </div>
    )
}

export default StarDropdown