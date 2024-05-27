module.exports.formatDate = (stringDate) => {
    const date = new Date(stringDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
}