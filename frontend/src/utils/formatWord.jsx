const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const convertToLowerCaseFirstLetter = (str) => {
  return str.replace(/\b\w/g, (match) => match.toLowerCase());
}
const formatLabel = (label) => {
    // Chuyển đổi 'submissionDate' thành 'Submission Date'
    return label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, (c) => c.toUpperCase());
  };


export {capitalizeFirstLetter, convertToLowerCaseFirstLetter, formatLabel}