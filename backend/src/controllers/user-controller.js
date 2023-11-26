const {status} = require('./../constants');

class UserController {
    // [GET] /api/v1/user/all
    getAll = async(req, res, next) => {
        const user = [
            {
                id: 1,
                username: 'khoi'
            },
            {
                id: 2,
                username: 'khoi2'
            }
        ]
        try {
            res.status(status.OK).json({
                message: 'get all user successfully',
                data: user
            })
        } catch(err) {
            next(err);
        }
    }
}

module.exports = UserController;