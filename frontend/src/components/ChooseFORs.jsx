import React, { useState } from 'react'
import Select from 'react-select';
import useConference from '../hooks/useConferences';

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
const ChooseFORs = ({ selectedOptions, onChange}) => {
  const {filterOptions} = useConference()

  const transformedState = filterOptions['fors'].map((item, index) => ({
    value: index + 1, // Dùng index + 1 để tạo id, có thể sử dụng một phương thức tạo id an toàn hơn nếu cần
    label: item,
  }));
   
    const CustomOption = ({ innerProps, label, isSelected }) => (
      <div {...innerProps}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className='m'
        />
        <label style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>{label}</label>
      </div>
    );
    
  return (
    <Select
      isMulti={true}
      options={transformedState}
      value={selectedOptions}
      components={{ Option: CustomOption }}
      onChange={onChange}
      styles={customStyles}      
      closeMenuOnSelect={false}
      isSearchable={true}
      placeholder="Select the field of research..."
    />
  )
}

export default ChooseFORs