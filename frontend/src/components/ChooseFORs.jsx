import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import useConference from '../hooks/useConferences';
import {FloatingLabel, Form} from "react-bootstrap"
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #155D68', // Điều chỉnh màu và độ dày của border khi focus
    borderRadius: '4px', // Điều chỉnh độ cong của góc
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(76, 139, 245, 0.25)' : null, // Hiệu ứng boxShadow khi focus
    '&:hover': {
      border: '2px solid #4c8bf5', // Điều chỉnh màu và độ dày của border khi hover
    },
  }),
};
const ChooseFORs = ({ selectedOptions, onChange }) => {
  const { filterOptions } = useConference()
  const [options, setOptions] = useState([]);
  
  const [inputValue, setInputValue] = useState('');
  useEffect(()=>{
    if(filterOptions['for']){
      const originalOptions = filterOptions['for'].map((item, index) => ({
        value: item,
        label: item,
      }));
      setOptions(originalOptions)
    }
  },[])
  
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleOnChange = (selectedOptions) => {
    
    onChange(selectedOptions);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
     const newValue = {
      label: inputValue,
      value: inputValue,
    };
      setOptions([...options, newValue]);
      
      onChange([...selectedOptions, ...[newValue]]);
      
      setInputValue('');
    }
  };

  const CustomOption = ({ innerProps, label, isSelected }) => (
    <div {...innerProps}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => { }}
        className='align-self-center'
      />
      <label style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>{label}</label>
    </div>
  );

  return (
    <div>

      <Select
        isMulti={true}
        options={options.length > 0 ? options : []}
        value={selectedOptions}
        components={{ Option: CustomOption }}
        onChange={handleOnChange}
        styles={customStyles}
        closeMenuOnSelect={false}
        isSearchable={true}
        placeholder="Select the field of research..."
        required

      />

<FloatingLabel controlId="floatingInput" label="+ Add new" className='text-center d-flex justify-content-center'>
      <Form.Control
        type="text"
        placeholder="Enter something"
        value={inputValue}
        name='inputValue'
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className='border-blue-normal'

      />
    </FloatingLabel>
    </div>
  )
}

export default ChooseFORs