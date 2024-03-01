// utils.js

const checkExistValue = (lists) => {
  return Object.entries(lists).map(([key, list]) => {  
    const hasElementsInList = list.some(item => item !== null && item !== undefined && item !== '');    
    return hasElementsInList
  });
}


  const mergeAndCountUniqueValues = (lists) => {
    const isExist = checkExistValue(lists).some(value => value === true);
    if(isExist){
      const newlists = Object.values(lists);
      const mergedList = [].concat(...newlists);
      const uniqueValues = Array.from(new Set(mergedList.map(JSON.stringify))).map(JSON.parse);
      
      const totalCount = uniqueValues.length;
      return { uniqueValues, totalCount };
    }
    else return []
  };
  const findKeyByKeyword = (optionsSelected, keyword) => {
    const keysWithKeyword = Object.keys(optionsSelected).find((key) =>
    optionsSelected[key].some((value) => value.toLowerCase().includes(keyword.toLowerCase()))
  );

  // Trả về key đầu tiên có từ khóa, nếu không tìm thấy trả về null hoặc giá trị mặc định
  return keysWithKeyword || null;
  };  
  

  export { checkExistValue, mergeAndCountUniqueValues, findKeyByKeyword };
  