export function formatDate(inputString) {
    const date = new Date(inputString);
    
    // Lấy thông tin ngày, tháng, năm
    const day = ('0' + date.getDate()).slice(-2); // Chắc chắn rằng ngày có 2 chữ số
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Chắc chắn rằng tháng có 2 chữ số
    const year = date.getFullYear();
  
    // Format lại chuỗi ngày tháng
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

export function formatDateFilter(date){
  const originalDateObject = new Date(date);

const year = originalDateObject.getFullYear();
const month = String(originalDateObject.getMonth() + 1).padStart(2, '0'); // Thêm '0' trước nếu tháng chỉ có một chữ số
const day = String(originalDateObject.getDate()).padStart(2, '0'); // Thêm '0' trước nếu ngày chỉ có một chữ số

const formattedDateString = `${year}-${month}-${day}`;
return formattedDateString
}

export function getDateValue(date_type, list) {
  const foundDate = list.find(date => date.date_type.includes(date_type));
  if (foundDate) {
    return foundDate.date_value;
  } else {
    return "NaN";
  }
}
