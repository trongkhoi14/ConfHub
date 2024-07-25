const fs = require('fs');

const data = fs.readFileSync('./src/keyword/submission_date_dict.txt', 'utf8');

const lines = data.split('\n');

const cleanedLines = lines.map(line => line.replace(/\r/g, ''));

const submissionKeywords = cleanedLines;

module.exports = { submissionKeywords }