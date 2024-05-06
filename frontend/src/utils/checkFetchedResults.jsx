// utils.js

const checkExistValue = (list) => {
  if (typeof list !== 'object' || list === null) {
    console.log('khong phai object', list)
    return [];
  }
  
  // Sử dụng Object.entries() khi list là object
  return Object.entries(list).map(([key, list]) => {
    const hasElementsInList = Array.isArray(list) && list.some(item => item !== null && item !== undefined && item !== '');
    
    return hasElementsInList;
  });
}


const getUniqueConferences = (list) => {
  const hasElementsInList = checkExistValue(list)
  const isExist = hasElementsInList.some(value => value === true);  
  if (isExist) {
    const newlist = Object.values(list);
    const mergedList = [].concat(...newlist);
    const uniqueValues = Array.from(new Set(mergedList.map(JSON.stringify))).map(JSON.parse);
    return uniqueValues
  }
  else return []
};
const findKeyByKeyword = (optionsSelected, keyword) => {
  const keysWithKeyword = Object.keys(optionsSelected).find((key) =>  
    optionsSelected[key].some((value) => value.includes(keyword))
  );

  // Trả về key đầu tiên có từ khóa, nếu không tìm thấy trả về null hoặc giá trị mặc định
  return keysWithKeyword || null;
};

const filterCommonConferences = (filteredList, authList) => {
  console.log({filteredList, authList})
  if(!filteredList) return authList
  return filteredList.filter(conf1 => 
    authList.some(conf2 => conf1.id === conf2.id)
  );
};


export { checkExistValue, getUniqueConferences, findKeyByKeyword, filterCommonConferences };
