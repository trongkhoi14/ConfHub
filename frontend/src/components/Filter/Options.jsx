//lấy dữ liệu từ danh sách để đưa vào dropdown
import React, { useEffect, useState } from 'react'
import useSearch from '../../hooks/useSearch'

import useConference from '../../hooks/useConferences'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import Select from 'react-select'

import data from './options.json'


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
            onChange={() => { }}
            className='m-2'
        />
        <label style={{ fontWeight: isSelected ? 'bold' : 'normal' }} className='fs-6'>{label}</label>
    </div>
);
const Options = ({ label, onApply }) => {
    const { filterOptions } = useConference()
    const { total, setTotal, getOptionsFilter, sendFilter, handleCountAllConf } = useSearch()
    const [options, setOptions] = useState([])
    const { addKeywords } = useSearch()
    const handleOptionChange = async (item) => {
        
        onApply(label, item[0].label)
        const maxRecords = await sendFilter(label, item[0].label)
        const keyword = `${item[0].label} (${maxRecords})`
        addKeywords(label,[keyword])
    }

    useEffect(() => {
        const staticValue = ["location", "type", "category"]
        
        if(staticValue.includes(label)){
        
            setOptions(data[label])
            getOptionsFilter(label, data[label])
        }
        else { 
            let transformedOptions = [] 
            if (filterOptions[label]) {
                transformedOptions = filterOptions[label].map((item, index) => ({
                    value: index + 1,
                    label: capitalizeFirstLetter(item),
                }));
            }
            setOptions(transformedOptions)
        }
        
    }, []);


    return (
        <div>
            <Select
                isMulti={true}
                options={options}
                value
                components={{ Option: CustomOption }}
                onChange={handleOptionChange}
                closeMenuOnSelect={true}
                styles={customStyles}
                placeholder="All"
                
            />
        </div>

    )
}

export default Options
