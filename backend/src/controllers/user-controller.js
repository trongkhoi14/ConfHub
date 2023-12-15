const User = require('../models/user-model')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const { generateAccessToken, generateRefreshToken} = require('../middlewares/jwt')


class UserController {
    // [POST] /api/v1/user/register
    register = asyncHandler(async (req, res) => {
        /* Params: Name, Phone, Email, Address, Nationality, Password */
        const { name, phone, email, address, nationality, password } = req.body
        if (!name || !phone || !email || !address || !nationality || !password) {
            return res.status(400).json({
                status: false,
                data: "Missing registration information"
            })
        }
        // check if the user with email are already existed
        const user = await User.findOne({email})
        if (user) {
            throw new Error('Email already exists')
        } else {
            const newUser = await User.create(req.body);
            return res.status(201).json({
                message: "Registration was successfully, please login",
                data: newUser
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
        const response = await User.findOne({email});
        if (!response) {
            return res.status(400).json({
                message: "Email not found.",
                data: []
            })
        }
        const passwordCorrect = await response.isCorrectPassword(password);
        //console.log(passwordCorrect);
        if (passwordCorrect) {
            const userData = response.toObject()
            // generate access token
            const accessToken = generateAccessToken(response._id, userData.role)
            // generate refresh token
            const newRefreshToken = generateRefreshToken(response._id)
            // save refresh token to the database
            await User.findByIdAndUpdate(response._id, {refreshToken: newRefreshToken}, {new: true})
            // save refresh token to cookie
            res.cookie('refreshToken', newRefreshToken, {httpOnly: true, maxAge: parseInt(process.env.REFRESH_TOKEN_DAYS) * 24 * 60 * 60 * 1000})
            return res.status(200).json({
                status: true,
                data: {
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email,
                    address: userData.address,
                    nationality: userData.nationality,
                    role: userData.role,
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

    // 
    getCurrentUser = asyncHandler( async (req, res) => {
        const { _id } = req.user
        const user = await User.findById(_id).select('-refreshToken -password -role -passwordChangedAt -passwordResetToken -passwordResetExpires')
        return res.status(200).json({
            status: user ? true:false,
            data: user ? user: 'User not found'
        })
    })

    //
    changePassword = asyncHandler( async (req, res) => {
        const { _id } = req.user
        if (!_id || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: false,
                message: "Nothing was updated."
            })
        }
        const {currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                status: false,
                message: "Missing inputs"
            })
        }
        // find the user
        const user = await User.findById(_id);
        const isCorrectPassword = await user.isCorrectPassword(currentPassword);
        if (!isCorrectPassword) {
            return res.status(400).json({
                status: false,
                message: "Current password did not match."
            })
        }
        //const hashedPassword = generatePassword(newPassword);
        user.password = newPassword
        await user.save();
    
        return res.status(200).json({
            status: true,
            message: "Password was changed successfully."
        })
    })

    //
    refreshAccessToken = asyncHandler(async (req, res) => {
        // get token from cookies
        const cookie = req.cookies
        // check if the refresh token is existed
        if (!cookie && !cookie.refreshToken) throw new Error('No refresh token')
        const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
        const response = await User.findOne({_id: rs._id, refreshToken: cookie.refreshToken})
        return res.status(200).json({
            status: response ? true:false,
            data: {
                newAccessToken: response ? generateAccessToken(response._id, response.role):'Refresh token not matched'
            }
        })
    })


    // [GET] /api/v1/user/logout
    logout = asyncHandler(async (req, res) => {
        const cookie = req.cookies
        if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
        // empty refreshToken in the database
        await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new: true})
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
        const users = await userModel.getAllUser();
                             
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