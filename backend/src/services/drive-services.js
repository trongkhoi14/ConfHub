const fs = require('fs');
const { google } = require('googleapis');
require('dotenv').config();

const CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

module.exports = {
    // Hàm đọc file định dạng .doc từ Google Drive
    readFileFromDrive: async () => {
        try {
            // Gửi yêu cầu để tải file từ Drive
            const response = await drive.files.export({
                fileId: '19LXkfAsBqHAHq-q0xkBpqbSluIJcUopAIDy6GGYioQI',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                alt: 'media'
            }, { responseType: 'stream' });



            return response.data;
        } catch (error) {
            console.error('Lỗi khi đọc file từ Drive:', error);
        }
    }
}