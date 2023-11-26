const {status} = require('./../constants');
const { userModel } = require('./../models')

class UserController {
    // [GET] /api/v1/user/all
    getAll = async (req, res, next) => {
        const users = await userModel.getAll();
        console.log(users)
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