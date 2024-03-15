//lấy dữ liệu từ danh sách để đưa vào dropdown
import React, { useEffect, useState } from 'react'
import useFilter from '../../hooks/useFilter'

import useConference from '../../hooks/useConferences'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import Select from 'react-select'
import useFollow from '../../hooks/useFollow'
const category = ["Conference", "Journal"]
const customStyles = {
   
    option: (provided, state) => ({
        ...provided,
        background: state.isFocused ? 'lightgray' : 'white',
        color: state.isFocused ? 'black' : 'gray',
        cursor: 'pointer',
        '&:hover': {
            background: 'lightgray', // Điều chỉnh màu nền khi hover
            color: 'black', // Điều chỉnh màu chữ khi hover
        },
    }),
};
const CustomOption = ({ innerProps, label, isSelected }) => (
    <div {...innerProps} className='d-flex align-items-start'>
        <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            className='m-2'
        />
        <label style={{ fontWeight: isSelected ? 'bold' : 'normal' }} className='fs-6'>{label}</label>
    </div>
);
const Options = ({ label }) => {
    const { filterOptions } = useConference()
    const [tranformOptions, setTranformOptions] = useState([])
    const { addKeywords } = useFilter()
    const { handleFilter} = useFollow()

    const handleOptionChange = (item) => {
        const selectedValues = item.map(option => option.label);
        addKeywords('filterOptionsFollowed', label, selectedValues)
    };
    useEffect(() => {
        let transformedState = []
        if (filterOptions !== null) {
            if (label === 'categories') {
                transformedState = category.map((item, index) => ({
                    value: index + 1,
                    label: item,
                }));
            } else if (filterOptions[label]) {
                transformedState = filterOptions[label].map((item, index) => ({
                    value: index + 1,
                    label: capitalizeFirstLetter(item),
                }));
            }

        }
        setTranformOptions(transformedState);
    }, [filterOptions, label, category]);


    return (
        <div>
            <Select
                isMulti={true}
                options={tranformOptions}
                value
                components={{ Option: CustomOption }}
                onChange={handleOptionChange}
                closeMenuOnSelect={false}
                styles={customStyles}
                placeholder="All"
                
            />
        </div>

    )
}

export default Options
