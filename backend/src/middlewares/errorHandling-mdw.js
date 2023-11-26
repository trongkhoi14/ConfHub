const {status} = require('./../constants');

const errorHandlingMDW = {
    handleErrorOccurAfterRequest: async(err, req, res, next)=>{
        let _status = null;
        let _message = '';

        if(err) {
            _status = err.cause || status.INTERNAL_ERROR;
            _message = err.length > 0 ? "Something occurs on our server" : err.message;
        }

        console.log(err);
        res.status(_status).json({
            message: _message
        })
    }
}

module.exports = errorHandlingMDW;