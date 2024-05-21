import { useState, useEffect } from 'react';
import { baseURL } from './api/baseApi'
import useSearch from './useSearch';
const useFilterStorage = (key, keyword) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalFilterConferences, setTotalFilterConferences] = useState(0)

    const { total, setTotal, extractQuantity, handleCountAllConf } = useSearch()
    const [filterSelected, setFilterSelected] = useState(() => {
        const storedOptions = sessionStorage.getItem('filter');
        return storedOptions ? JSON.parse(storedOptions) : {
            location: [],
            rank: [],
            for: [],
            source: [],
            acronym: [],
            type: [],
            conferenceDate: [],
            submissionDate: [],

            search: [],
            rating: [],
            category: [],
        };
    });
    const [dataFilters, setDataFilters] = useState(() => {
        const storedDataFilters = sessionStorage.getItem('dataFilters');
        return storedDataFilters ? JSON.parse(storedDataFilters) : {};
    });
    useEffect(() => {
        if (!key || !keyword) return;
        console.log({key, keyword})
        const fetchPage = async (page) => {
            const listkey = ['location', 'rank', 'for', 'source', 'acronym', 'type'];
            let apiUrl = baseURL;
            if (keyword.includes('Sub')) {
                // Biểu thức chính quy để trích xuất ngày
                const dateRegex = /from (\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})/;

                // Sử dụng biểu thức chính quy để tìm các ngày trong chuỗi
                const match = keyword.match(dateRegex);

                if (match) {
                    const startDate = match[1];
                    const endDate = match[2];
                    apiUrl += `/conference?page=${page}&size=7&subStart=${startDate}&subEnd=${endDate}`;
                }

            }
            else if (keyword.includes('Conf')) {
                // Biểu thức chính quy để trích xuất ngày
                const dateRegex = /from (\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})/;

                // Sử dụng biểu thức chính quy để tìm các ngày trong chuỗi
                const match = keyword.match(dateRegex);

                if (match) {
                    const startDate = match[1];
                    const endDate = match[2];
                    apiUrl += `/conference?page=${page}&size=7&confStart=${startDate}&confEnd=${endDate}`;
                }
            }
            else if (listkey.includes(key)) {
                apiUrl += `/conference?page=${page}&size=7&${key}[]=${keyword}`;
            } else {
                apiUrl += `/conference?page=${page}&size=7&${key}=${keyword}`;
                
                console.log({key, keyword})
            }

            console.log({apiUrl})
            const response = await fetch(`${apiUrl}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        };


        const fetchAllPages = async () => {
            setLoading(true);
            try {
                const firstPageData = await fetchPage(1);
                setLoading(false)
                // Cập nhật filterSelected và lưu vào sessionStorage ngay lập tức
                const updatedFilterSelected = { ...filterSelected };
                if (!updatedFilterSelected[key].includes(keyword)) {
                    updatedFilterSelected[key].push(keyword);
                }
                setFilterSelected(updatedFilterSelected);
                sessionStorage.setItem('filterSelected', JSON.stringify(updatedFilterSelected));

                // Cập nhật dataFilters với trang đầu tiên và lưu vào sessionStorage
                const updatedDataFilters = { ...dataFilters };
                updatedDataFilters[keyword] = firstPageData.data;
                setDataFilters(updatedDataFilters);

                sessionStorage.setItem('dataFilters', JSON.stringify(updatedDataFilters));

                // Fetch remaining pages asynchronously
                for (let i = 2; i <= firstPageData.maxPages; i++) {
                    fetchPage(i).then(pageData => {
                        const storedDataFilters = sessionStorage.getItem('dataFilters');
                        const parsedDataFilters = storedDataFilters ? JSON.parse(storedDataFilters) : {};
                        parsedDataFilters[keyword] = [...(parsedDataFilters[keyword] || []), ...pageData.data];
                        sessionStorage.setItem('dataFilters', JSON.stringify(parsedDataFilters));
                        setDataFilters(parsedDataFilters)
                    });
                }

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchAllPages();
    }, [key, keyword]);

    const clearKeyValues = (keyToClear) => {
        console.log({ keyToClear })
        const updatedfilterSelected = { ...filterSelected, [keyToClear]: [] };
        setFilterSelected(updatedfilterSelected);
        sessionStorage.setItem('filterSelected', JSON.stringify(updatedfilterSelected));

        // Cập nhật dataFilters
        const updatedDataFilters = { ...dataFilters };

        const quantity = extractQuantity(keyword)
        setTotal(total - quantity)
        delete updatedDataFilters[keyToClear];
        setDataFilters(updatedDataFilters);
        sessionStorage.setItem('dataFilters', JSON.stringify(updatedDataFilters));
    };
    const clearAllKeywords = () => {
        setDataFilters({});
        setData([])
        setTotal(0)
        sessionStorage.removeItem('dataFilters');
        sessionStorage.removeItem('filterSelected');
    }


    return {
        data,
        dataFilters,
        loading,
        error,

        filterSelected,
        totalFilterConferences,
        setTotalFilterConferences,
        clearKeyValues,
        clearAllKeywords,
    };
};

export default useFilterStorage;
