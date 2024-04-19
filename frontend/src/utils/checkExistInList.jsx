const isObjectInList = (id, list) => {
    const result = list.some(item => item.cfp_id === id);
    return result
  };

export {isObjectInList}