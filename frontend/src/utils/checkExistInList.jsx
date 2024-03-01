const isObjectInList = (id, list) => {
    const result = list.some(item => item._id === id);
    return result
  };

export {isObjectInList}