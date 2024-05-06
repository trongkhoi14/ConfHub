const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    // Bearer token
    // headers: {authorization: Bearer token}
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
            if (error) return res.status(401).json({
                status: false,
                data: 'Identification failed'
            })
            req.user = decode
            next()
        })
    } else {
        return res.status(401).json({
            status: false,
            data: 'Authetication failed'
        })
    }
}) 

module.exports = {
    verifyAccessToken
}