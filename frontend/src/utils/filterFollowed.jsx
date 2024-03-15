import { convertToLowerCaseFirstLetter } from "./formatWord";

const filterListbyCondition = (conferences, listOptions) => {

    // Duyệt qua từng thuộc tính trong filters 
    const filteredConferences = conferences.filter(conference => {
        if (listOptions.submissionDate.length > 0) {
            // Xử lý trường hợp submissionDate
            const dateRegex = /(\d{2}\/\d{2}\/\d{4})/g;
            const dateString = listOptions.submissionDate[0]; // Lấy chuỗi từ listOptions
            const matches = dateString.match(dateRegex);

            if (matches && matches.length >= 2) {
                const startDate = new Date(matches[0]);
                const endDate = new Date(matches[1]);

                const isWithinRange = conference.document.some(doc => {
                    const submissionDate = new Date(doc.submissionDate);
                    return submissionDate >= startDate && submissionDate <= endDate;
                });

                return isWithinRange;
            }
        } 
        else if (listOptions.date.length > 0) {
            
            const dateRegex = /(\d{2}\/\d{2}\/\d{4})/g;
            const dateString = listOptions.date[0]; // Lấy chuỗi từ listOptions
            const matches = dateString.match(dateRegex);
            if (matches && matches.length > 0) {
                const filterDate = new Date(conference.date);
                const startDate = new Date(matches[0]);
                const endDate = new Date(matches[1]);
                // So sánh xem filterDate có nằm trong khoảng từ startDate đến endDate không
                return filterDate >= startDate && filterDate <= endDate;
            }
        }
        else if (listOptions.rating.length > 0) {
            const extractedRating= parseInt(listOptions.rating[0].match(/\d+/));
            const avgRating = conference.rating.avgRating; 
            return extractedRating < avgRating;
        }
        else {

            return Object.keys(listOptions).some(filterKey => {

                let formatKey = filterKey
                let formatFilterOptions = listOptions[filterKey]

                if (filterKey === 'types') {
                    formatFilterOptions = listOptions[filterKey].map(value => convertToLowerCaseFirstLetter(value));
                }

                if (filterKey === 'fors') {
                    formatKey = 'fieldOfResearch'
                }
                else if (filterKey === 'search') {
                    formatKey = 'name'
                    formatFilterOptions = listOptions[filterKey].map(value => value.toUpperCase())
                }
                else if (filterKey === 'categories') {
                    formatKey = 'category'
                }
                else if (filterKey.endsWith("s")) {
                    formatKey = filterKey.slice(0, -1)
                }
                
                const conferenceValue = conference[formatKey];
                return formatFilterOptions.includes(conferenceValue);

            });
        }
    });
    return filteredConferences;

};

export { filterListbyCondition };
