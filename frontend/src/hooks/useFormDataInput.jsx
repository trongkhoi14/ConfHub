import { useEffect, useState } from 'react';

const useFormDataInput = (initialFormData) => {
    const [formData, setFormData] = useState(initialFormData);
    const [selectedFieldOfResearch, setSelectedFieldOfResearch] = useState([]);                                                                                                                                                                                                                                                                                                                                                                                                                   
    const [dateListByRound, setDateListByRound] = useState({})
    const [importantDates, setImportantDates] = useState([
        { date_type: 'submission date', date_value: '' },
        { date_type: 'camera ready', date_value: '' },
        { date_type: 'registration date', date_value: '' },
        { date_type: 'notification date', date_value: '' },
    ]);
    const [requiredFields, setRequiredFields] = useState({
        conf_name: true,
        acronym: true,
        callForPaper: true,
        link: true,
        rank: true,
        organization: {
            type: true,
            location: true,
            conf_date: true,
        },
        fieldOfResearch: true,
        important_date: [
            { date_type: 'Submission date', date_value: true },
            { date_type: 'Camera ready', date_value: true },
            { date_type: 'Registration date', date_value: true },
            { date_type: 'Notification date', date_value: true },
        ],
    })
    // Hàm để thêm một ngày vào round cụ thể
const addDateToRound = (round, date) => {
    // Tạo một bản sao của dateListByRound để tránh ghi đè trực tiếp lên state
    const updatedDateListByRound =JSON.parse(JSON.stringify(dateListByRound));

    // Kiểm tra xem round đã tồn tại trong danh sách chưa
    if (Object.prototype.hasOwnProperty.call(updatedDateListByRound, round)) {
      // Nếu round đã tồn tại, kiểm tra xem date_type đã tồn tại trong mảng ngày của round hay không
      const existingIndex = updatedDateListByRound[round].findIndex(existingDate => existingDate.date_type === date.date_type);
      if (existingIndex !== -1) {
        // Nếu tồn tại, thay thế giá trị của ngày đó
       
        updatedDateListByRound[round][existingIndex] = date;
      } else {
        // Nếu không tồn tại, thêm ngày vào mảng tương ứng
        updatedDateListByRound[round].push(date);
      }
    } else {
      // Nếu chưa tồn tại, tạo một mảng mới để lưu ngày
        updatedDateListByRound[round] = [date];
    }

    // Cập nhật state với giá trị mới
    setDateListByRound(updatedDateListByRound);
  };

  
  // Hàm để gộp tất cả các ngày từ mỗi round thành một danh sách duy nhất
  const mergeDatesByRound = () => {
    const mergedDates = [];
    // Duyệt qua từng round trong dateListByRound
    for (const round in dateListByRound) {
      if (Object.prototype.hasOwnProperty.call(dateListByRound, round)) {
        // Lặp qua mỗi ngày trong round
        dateListByRound[round].forEach(date => {
          // Thay đổi date_type cho từng ngày
          const newDateType = `Round ${round} - ${date.date_type}`;
          // Thêm ngày mới với date_type đã thay đổi vào danh sách cuối cùng
          mergedDates.push({ ...date, date_type: newDateType });
        });
      }
    }
    return mergedDates;
  };
  
  const separateDatesByRound = (importantDates) => {
    const separatedDates = {};
    
    importantDates.forEach(date => {
        let round, eventName;
        if (date.date_type.includes(' - ')) {
            [round, eventName] = date.date_type.split(' - ');
        } else {
            round = 'Round 1';
            eventName = date.date_type;
        }
        if (!separatedDates[round]) {
            separatedDates[round] = []; // Tạo danh sách mới nếu chưa tồn tại
        }
        separatedDates[round].push({ ...date, date_type: eventName }); 
        console.log('truoc khi', separatedDates)
        const updatedDates = separatedDates[round].map(date => {
            console.log(separatedDates[round])
            if (date.status === 'new') {
              const oldDate = separatedDates[round].find(d => d.status === 'old' && d.date_type === date.date_type);
              if (oldDate) {
                date.date_value_old = oldDate.date_value;
              }
            }
            return date;
          }).filter(date => date.status !== 'old'); // bỏ ngày old
          separatedDates[round] = updatedDates
    });

    return separatedDates;
};

    const handleOrganizationChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            organization: {
                ...prevFormData.organization,
                [name]: value,
            },
        }));
        setRequiredFields((prevFormData) => ({
            ...prevFormData,
            organization: {
                ...prevFormData.organization,
                [name]: true,
            },
        }));
    };

    const handleFieldOfResearchChange = (selectedOption) => {
        setSelectedFieldOfResearch(selectedFieldOfResearch)
        const selectedValues = selectedOption.map(option => ({
            for_name: option.value
        }));
        setFormData({
            ...formData,
            fieldOfResearch: selectedValues,
        });
        setRequiredFields({
            ...formData,
            fieldOfResearch: true,
        });
    };

    const resetForm = () => {
        setFormData({
            conf_name: '',
            acronym: '',
            callForPaper: '',
            link: '',
            rank: '',
            source_name: '',
            fieldOfResearch: [],
            organization: {
                start_date: '',
                end_date: '',
                type: '',
                location: '',
            },
            important_date: [],
        });
        setRequiredFields({
            conf_name: true,
            acronym: true,
            callForPaper: true,
            link: true,
            rank: true,
            source_name: true,
            organization: {
                type: true,
                location: true,
                start_date: true,
                end_date: true
            },
            fieldOfResearch: true,
            important_date: [
                { date_type: 'submission date', date_value: true },
                { date_type: 'camera ready', date_value: true },
                { date_type: 'camera ready', date_value: true },
                { date_type: 'notification date', date_value: true },
            ],
        })

        setSelectedFieldOfResearch([])
    };

    return {
        formData,
        selectedFieldOfResearch,
        importantDates,
        requiredFields,
        dateListByRound,
        addDateToRound,
        mergeDatesByRound,
        separateDatesByRound,
        setRequiredFields,
        handleOrganizationChange,
        handleFieldOfResearchChange,
        resetForm,
    };
};

export default useFormDataInput;
