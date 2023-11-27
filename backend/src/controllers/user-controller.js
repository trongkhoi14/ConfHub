const {status} = require('./../constants');
const { userModel } = require('./../models')

class UserController {
    // [GET] /api/v1/user/all
    getAll = async (req, res, next) => {
        // Trỏ xuống model lấy dữ liệu 
        const users = await userModel.getAll();
                             
        try {
            res.status(status.OK).json({
                message: 'get all user successfully',
                data: users
            })
        } catch(err) {
            next(err);
        }
    }
}

module.exports = UserController;