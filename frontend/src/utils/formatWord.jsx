const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const formatLabel = (label) => {
    // Chuyển đổi 'submissionDate' thành 'Submission Date'
    return label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, (c) => c.toUpperCase());
  };


export {capitalizeFirstLetter, formatLabel}