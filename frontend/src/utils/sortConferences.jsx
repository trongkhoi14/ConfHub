import { checkExistValue } from "./checkFetchedResults";

const isUpcoming = (dateString) => {
  const today = new Date(); // Ngày hiện tại

  // Chuyển đổi chuỗi ngày đầu vào thành đối tượng ngày
  const eventDate = new Date(dateString);

  // Nếu ngày sự kiện đã qua ngày hiện tại, return false
  if (eventDate < today) {
    return false;
  }

  const oneMonthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  
  // So sánh ngày của sự kiện với khoảng thời gian một tháng tính từ ngày hiện tại
  return eventDate <= oneMonthFromNow;
};


const sortByUpcoming = (conferences) => {
   const today = new Date();

  // Sắp xếp danh sách các hội nghị theo ngày diễn ra
  conferences.sort((a, b) => {
    const dateA = new Date(a.organizations[0].conf_date);
    const dateB = new Date(b.organizations[0].conf_date);

    // Kiểm tra xem hội nghị A đã diễn ra hay chưa
    const hasHappenedA = dateA < today;
    // Kiểm tra xem hội nghị B đã diễn ra hay chưa
    const hasHappenedB = dateB < today;

    // Nếu cả hai hội nghị đều đã diễn ra hoặc chưa diễn ra,
    // hoặc nếu hội nghị A đã diễn ra thì đưa nó xuống cuối danh sách
    if ((hasHappenedA && hasHappenedB) || (hasHappenedA && !hasHappenedB)) {
      return 1;
    }
    // Nếu hội nghị B đã diễn ra thì đưa nó xuống cuối danh sách
    if (!hasHappenedA && hasHappenedB) {
      return -1;
    }
    // Nếu cả hai hội nghị chưa diễn ra, hoặc nếu cả hai đều đã diễn ra,
    // hoặc nếu cả hai hội nghị cùng diễn ra vào một ngày, sắp xếp theo conf_id
    if (dateA - dateB === 0) {
      return a.conf_id - b.conf_id;
    }
    // Sắp xếp theo ngày diễn ra
    return dateA - dateB;
  });

  return conferences;
};

const sortByName = (conferences) => {
  return conferences.sort((a, b) => {
    const labelA = a.name.toLowerCase();
    const labelB = b.name.toLowerCase();

    if (labelA < labelB) {
      return -1;
    }
    if (labelA > labelB) {
      return 1;
    }
    // Nếu tên giống nhau, sắp xếp theo ID
    return a.conf_id - b.conf_id;
  });
}

const sortByLatest = (conferences) => {
  return conferences.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt); 5
    // So sánh ngày tháng, sự kiện có ngày mới nhất sẽ được đặt trước
    return dateB - dateA;
  });
}


const sortAndFilterConferences = (conferences) => {
  const hasElementsInList = checkExistValue(conferences)
  const isExist = hasElementsInList.some(value => value === true);
  if (isExist) {
    const newlist = Object.values(conferences);
    const listConfereneces = [].concat(...newlist);
    // Đếm số lần xuất hiện của mỗi conference
    const countMap = {};
    listConfereneces.forEach(conf => {
      const key = JSON.stringify(conf); // Sử dụng JSON.stringify để biến đổi conference thành chuỗi duy nhất
      countMap[key] = (countMap[key] || 0) + 1;
    });

    // Sắp xếp danh sách theo số lần xuất hiện giảm dần và nếu số lần xuất hiện bằng nhau thì sắp xếp theo tên
    const sortedUniqueConferences = listConfereneces.sort((a, b) => {
      const countA = countMap[JSON.stringify(a)];
      const countB = countMap[JSON.stringify(b)];
      if (countA === countB) {
        return a.name.localeCompare(b.name); // So sánh theo tên nếu số lần xuất hiện bằng nhau
      }
      return countB - countA; // Sắp xếp giảm dần theo số lần xuất hiện
    });
    // Loại bỏ các phần tử trùng lặp để chỉ giữ lại các conference duy nhất
    const uniqueConferences = sortedUniqueConferences.filter((conf, index, array) =>
  array.findIndex(c => c.cfp_id === conf.cfp_id) === index
);

    return uniqueConferences;
  }
  else return []
};

const sortConferences = (sortby, conferences) => {
  const hasElementsInList = checkExistValue(conferences)
  const isExist = hasElementsInList.some(value => value === true);
  if (isExist || conferences.length > 0) {
    switch (sortby) {
      case 'Name A > Z':
        // Sắp xếp theo tên
        return sortByName(conferences)
      case 'Upcoming':
        // Sắp xếp theo thời gian
        return sortByUpcoming(conferences)
      case 'Latest':
        return sortByLatest(conferences)
      case 'Random':
        return sortAndFilterConferences(conferences)
      default:
        // Trường hợp mặc định, không có sắp xếp
        return conferences;
    }
  }
  else return []
};

export { sortConferences, isUpcoming }