const { status } = require('./../constants');
const { userModel } = require('./../models')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const { generateAccessToken, generateRefreshToken} = require('../middlewares/jwt')
const CryptoJS = require('crypto-js');
const hashLength = 64;

class UserController {
    // [POST] /api/v1/user/register
    register = asyncHandler(async (req, res) => {
        /* Params: Name, Phone, Email, Address, Nationality, Password */
        const { name, phone, email, address, nationality, password } = req.body
        if (!name || !phone || !email || !address || !nationality || !password) {
            return res.status(400).json({
                message: "Missing registration information",
                data: []
            })
        }
        // check if the user with email are already existed
        const user = await userModel.getUserByEmail(email);
        if (user.length > 0) {
            throw new Error('Email already exists');
        } else {
            // hash password
            const salt = Date.now().toString(16);
            const pwSalt = password + salt;
            const pwHashed = CryptoJS.SHA3(pwSalt, { outputLength: hashLength*4 })
                .toString(CryptoJS.enc.Hex);

            // get list all account
            const allAccount = await userModel.getAllUser();

            const acc = {
                id: `A0${allAccount.length+1}`,
                name: name,
                phone: phone,
                email: email,
                address: address,
                nationality: nationality,
                password: pwHashed + salt
            }

            // add new user (new account)
            const newUser = await userModel.createUser(acc);
            return res.status(201).json({
                message: "Registration was successfully, please login",
                data: []
            })
        }
    })

    // [POST] /api/v1/user/login
    // Refresh token: Use for create a new accessToken
    // Access token: use for user authentication and authorization
    login = asyncHandler( async (req, res) => {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "Missing login information.",
                data: []
            })
        }

        // Kiểm tra email
        const users = await userModel.getUserByEmail(email);
        if (users.length == 0) {
            return res.status(400).json({
                message: "Email not found.",
                data: []
            })
        }
        
        // Kiểm tra mật khẩu 
        const passwordDB = users[0].ACC_PASSWORD;
        const salt = passwordDB.slice(hashLength);
        const pwSalt = password + salt;
        const pwHashed = CryptoJS.SHA3(pwSalt, { outputLength: hashLength*4 })
            .toString(CryptoJS.enc.Hex);

        if (passwordDB === (pwHashed + salt)) {
            const userData = users[0]
            // generate access token
            const accessToken = generateAccessToken(userData.ACC_ID)
            // generate refresh token
            const newRefreshToken = generateRefreshToken(userData.ACC_ID)
            // save refresh token to the database
            await userModel.updateUserTokenById(userData.ACC_ID, newRefreshToken)
            // save refresh token to cookie
            res.cookie('refreshToken', newRefreshToken, {httpOnly: true, maxAge: parseInt(process.env.REFRESH_TOKEN_DAYS) * 24 * 60 * 60 * 1000})
            return res.status(200).json({
                message: "Login successfully",
                data: {
                    id: userData.ACC_ID,
                    name: userData.ACC_NAME,
                    phone:userData.ACC_PHONE,
                    email:userData.ACC_EMAIL,
                    address:userData.ACC_ADDRESS,
                    nationality:userData.ACC_NATIONALITY,
                    accessToken
                }
            })
        } else {
            return res.status(400).json({
                message: "Incorrect password",
                data: []
            })
        }
    })

    // [GET] /api/v1/user/logout
    logout = asyncHandler(async (req, res) => {
        const cookie = req.cookies
        if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
        // empty refreshToken in the database
        await userModel.updateUserTokenByToken(cookie.refreshToken, '')
        // delete refreshToken in the browser's cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        })
        return res.status(200).json({
            success: true,
            message: "Logged out!"
        })
    })

    // [GET] /api/v1/user/all
    getAll = async (req, res, next) => {
        // Trỏ xuống model lấy dữ liệu 
        const users = await userModel.getAll();
                             
        try {
            res.status(status.OK).json({
                message: "Get all user successfully",
                data: users
            })
        } catch(err) {
            next(err);
        }
    }

    //
}

module.exports = UserController;