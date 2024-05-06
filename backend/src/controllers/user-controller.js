const { userModel } = require('../models/index');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const { status } = require('./../constants');
const { Op } = require('sequelize');
const sequelize = require('../config/database.js');
const model = require('../models')

class UserController {
    // [POST] /api/v1/user/register
    register = asyncHandler(async (req, res) => {
        /* Params: Name, Phone, Email, Address, Nationality, Password */
        const { name, phone, email, address, nationality, password } = req.body
        if (!name || !phone || !email || !address || !nationality || !password) {
            return res.status(status.BAD_REQUEST).json({
                status: false,
                data: "Missing registration information"
            });
        };
        // check if the user with email are already existed
        const user = await userModel.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        })
        if (user) {
            throw new Error('Email or phone number already exists.')
        } else {
            const t = await sequelize.transaction();
            const newUser = await userModel.create(req.body, { transaction: t });

            await model.settingModel.bulkCreate([
                { name: process.env.DATA_UPDATE_CYCLE, value: 3, status: true, UserId: newUser.id },
                { name: process.env.EXTEND_DATE, status: true, UserId: newUser.id },
                { name: process.env.CHANGE_AND_UPDATE, status: true, UserId: newUser.id },
                { name: process.env.UPCOMING_EVENT, status: true, UserId: newUser.id },
                { name: process.env.CANCELLED_EVENT, status: true, UserId: newUser.id },
                { name: process.env.YOUR_UPCOMING_EVENT, status: true, UserId: newUser.id },
                { name: process.env.AUTO_ADD_EVENT_TO_SCHEDULE, status: true, UserId: newUser.id }
            ], { transaction: t });

            await t.commit();

            return res.status(status.CREATED).json({
                message: "Registration was successfully, please login",
                data: newUser
            })
        }
    })

    // [POST] /api/v1/user/login
    // Refresh token: Use for create a new accessToken
    // Access token: use for user authentication and authorization
    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(status.BAD_REQUEST).json({
                message: "Missing login information.",
                data: []
            })
        }
        const response = await userModel.findOne({ where: { email: email } });
        if (!response) {
            return res.status(status.BAD_REQUEST).json({
                message: "Email not found.",
                data: []
            })
        }
        const passwordCorrect = await response.isCorrectPassword(password);
        //console.log(passwordCorrect);
        if (passwordCorrect) {
            // generate access token
            const accessToken = generateAccessToken(response.id, response.role)
            // generate refresh token
            const newRefreshToken = generateRefreshToken(response.id)
            // save refresh token to the database
            await userModel.update(
                { refreshToken: newRefreshToken },
                { where: { id: response.id }, returning: true })
            // save refresh token to cookie
            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: parseInt(process.env.REFRESH_TOKEN_DAYS) * 24 * 60 * 60 * 1000 })
            return res.status(status.OK).json({
                message: "Login successfully",
                data: {
                    name: response.name,
                    phone: response.phone,
                    email: response.email,
                    address: response.address,
                    nationality: response.nationality,
                    role: response.role,
                    accessToken
                }
            })
        } else {
            return res.status(status.BAD_REQUEST).json({
                message: "Incorrect password",
                data: []
            })
        }
    })

    // [GET] /api/v1/user/login/current
    getCurrentUser = asyncHandler(async (req, res) => {
        const { _id } = req.user
        const user = await userModel.findByPk(_id, {
            attributes: {
                exclude: [
                    'refreshToken',
                    'password',
                    'passwordChangedAt',
                    'passwordResetToken',
                    'passwordResetExpires'
                ]
            }
        });
        return res.status(status.OK).json({
            status: user ? true : false,
            data: user ? user : 'User not found'
        })
    })

    // [PUT] /api/v1/user/changePassword
    changePassword = asyncHandler(async (req, res) => {
        const { _id } = req.user
        if (!_id || Object.keys(req.body).length === 0) {
            return res.status(status.BAD_REQUEST).json({
                status: false,
                message: "Nothing was updated."
            })
        }
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(status.BAD_REQUEST).json({
                status: false,
                message: "Missing inputs"
            })
        }
        // find the user
        const user = await userModel.findByPk(_id);
        const isCorrectPassword = await user.isCorrectPassword(currentPassword);
        if (!isCorrectPassword) {
            return res.status(status.BAD_REQUEST).json({
                status: false,
                message: "Current password did not match."
            })
        }
        //const hashedPassword = generatePassword(newPassword);
        user.password = newPassword
        await user.save();

        return res.status(status.OK).json({
            id: _id,
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
        const response = await userModel.findOne({ id: rs._id, refreshToken: cookie.refreshToken })
        return res.status(status.OK).json({
            status: response ? true : false,
            data: { newAccessToken: response ? generateAccessToken(response.id, response.role) : 'Refresh token not matched' }
        })
    })

    // [GET] /api/v1/user/logout
    logout = asyncHandler(async (req, res) => {
        const cookie = req.cookies
        if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
        // empty refreshToken in the database
        await userModel.update({ refreshToken: '' }, { where: { refreshToken: cookie.refreshToken } });
        // delete refreshToken in the browser's cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        })
        return res.status(status.OK).json({
            success: true,
            message: "Logged out!"
        })
    })

    // [GET] /api/v1/user/
    getAll = asyncHandler(async (req, res, next) => {
        // Trỏ xuống model lấy dữ liệu 
        const users = await userModel.findAll();
        try {
            res.status(status.OK).json({
                message: "Get all users successfully",
                data: users
            })
        } catch (err) {
            next(err);
        }
    });

    // [PUT] /api/v1/user/:id
    updateUser = asyncHandler(async (req, res, next) => {
        try {
            const { _id } = req.user
            if (!_id || Object.keys(req.body).length === 0) {
                return res.status(status.BAD_REQUEST).json({
                    status: false,
                    message: "Nothing was updated."
                })
            }

            const { name, phone, address, nationality, license } = req.body
            if (!name || !phone || !address || !nationality) {
                return res.status(status.BAD_REQUEST).json({
                    status: false,
                    data: "Missing informations."
                })
            }

            const user = await userModel.findByPk(_id, { attributes: ['role'] });
            const role = user.role;
            if (role) {
                await userModel.update(
                    {
                        name: name,
                        phone: phone,
                        address: address,
                        nationality: nationality
                    },
                    { where: { id: _id } }
                );
            }

            res.status(status.OK).json({
                message: "Update user successfully",
            });

        } catch (err) {
            next(err);
        }
    });
}

module.exports = UserController;