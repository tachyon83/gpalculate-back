const dao = require('../models/Dao')

module.exports = {
    addSemester: (req, res) => {
        const resCode = req.app.get('resCode')
        req.body.userId = req.userInfo.id

        const responseHandler = result => {
            if (!result.affectedRows) {
                res.json({
                    result: false,
                    code: resCode.existOnAdd,
                    data: null,
                })
            } else {
                res.json({
                    result: true,
                    code: resCode.success,
                    data: null,
                })
            }
        }
        const errorHandler = err => {
            console.log(err)
            res.json({
                result: false,
                code: resCode.error,
                data: null,
            })
        }
        dao.addSemester(req.body)
            .then(responseHandler)
            .catch(errorHandler)
    },

    deleteSemester: (req, res) => {
        const resCode = req.app.get('resCode')

        const responseHandler = result => {
            if (!result) {
                res.json({
                    result: false,
                    code: resCode.error,
                    data: null,
                })
            } else {
                res.json({
                    result: true,
                    code: resCode.success,
                    data: null,
                })
            }
        }
        const errorHandler = err => {
            res.json({
                result: false,
                code: resCode.error,
                data: null,
            })
        }

        dao.deleteSemester(req.body.id)
            .then(responseHandler)
            .catch(errorHandler)
    },
}