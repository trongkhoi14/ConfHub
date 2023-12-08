const { query } = require('express');
const connection = require('./../config/database')

module.exports = {
    // demo
    getAllUser: async () => {
        try {
            // Mở kết nối đến database
            await connection.connect();
            // Thực hiện truy vấn
            const result = await connection.request().query(`SELECT * FROM ACCOUNT`)
            // Đóng kết nối
            await connection.close();
            return result.recordset;
        } catch (error) {
            console.log(error);
        }
    },

    // Lấy người dùng theo Email
    getUserByEmail: async (email) => {
        try {
            await connection.connect();
            const result = await connection.request()
            .query(`SELECT * FROM ACCOUNT WHERE ACC_EMAIL = '${email}'`)
            await connection.close();
            //console.log(result.recordset)
            return result.recordset;
        } catch (error) {
            console.log(error);
        }
    },

    // Tạo người dùng mới
    createUser: async (acc) => {
        try {
            // Mở kết nối đến database
            await connection.connect();
            // Thực hiện truy vấn
            queryStr = `INSERT INTO ACCOUNT (ACC_ID, ACC_NAME, ACC_PHONE, ACC_EMAIL, ACC_ADDRESS, ACC_NATIONALITY, ACC_PASSWORD) 
            VALUES ('${acc.id}', '${acc.name}', '${acc.phone}', '${acc.email}', '${acc.address}', '${acc.nationality}', '${acc.password}')`;
            const result = await connection.request().query(queryStr);
            // Đóng kết nối
            await connection.close();
            return true;
        } catch (error) {
            console.log(error);
        }
    },

    // Cập nhật người dùng
    updateUser: async () => {
        try {
            
        } catch (error) {
            
        }
    },

    // Cập nhật token người dùng theo id
    updateUserTokenById: async (id, token) => {
        try {
            // Mở kết nối đến database
            await connection.connect();
            // Thực hiện truy vấn
            queryStr = `UPDATE ACCOUNT SET ACC_TOKEN = '${token}' WHERE ACC_ID = '${id}'`;
            const result = await connection.request().query(queryStr);
            // Đóng kết nối
            await connection.close();
        } catch (error) {
            
        }
    },

    // Cập nhật token người dùng theo id
    updateUserTokenByToken: async (old_token, new_token) => {
        try {
            // Mở kết nối đến database
            await connection.connect();
            // Thực hiện truy vấn
            queryStr = `UPDATE ACCOUNT SET ACC_TOKEN = '${new_token}' WHERE ACC_TOKEN = '${old_token}'`;
            const result = await connection.request().query(queryStr);
            // Đóng kết nối
            await connection.close();
        } catch (error) {
            
        }
    }

    // Xóa người dùng

    
}