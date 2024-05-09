const jwt = require('jsonwebtoken');
const query = require('../utils/queries');
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    // Bearer token
    // headers: {authorization: Bearer token}
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
            if (error) return res.status(401).json({
                status: false,
                data: 'Identification failed'
            });
            req.user = decode;
            next();
        })
    } else {
        return res.status(401).json({
            status: false,
            data: 'Authetication failed'
        });
    }
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
    // Bearer token
    // headers: {authorization: Bearer token}
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
            if (error) return res.status(401).json({
                status: false,
                data: 'Identification failed'
            });
            req.user = decode;
            next();
        })
    } else {
        next();
    }
});

const checkUserLicense = asyncHandler(async (req, res, next) => {
    const user = await query.UserQuery.selectUser(req.user?._id);
    if (user && (user.role.toLowerCase() === "admin" || (user.role.toLowerCase() === "user" && user.license))) {
        next();

    } else {
        return res.status(403).json({
            status: false,
            data: 'You do not have permissions.'
        });
    }
});

const checkAdminRole = asyncHandler(async (req, res, next) => {
    const user = await query.UserQuery.selectUser(req.user?._id);
    if (user) {
        if (user.role.toLowerCase() === "admin") {
            next();

        } else {
            return res.status(403).json({
                status: false,
                data: 'You do not have permissions.'
            });
        }

    } else {
        return res.status(403).json({
            status: false,
            data: 'You do not have permissions.'
        });
    }
});

module.exports = {
    verifyAccessToken,
    getCurrentUser,
    checkUserLicense,
    checkAdminRole
}