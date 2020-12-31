const dao = require('../models/Dao')

module.exports = {
    addAssessment: (req, res) => {
        const resCode = req.app.get('resCode')

        const responseHandler = result => {
            if (!result.affectedRows) {
                res.json({
                    result: false,
                    code: resCode.existOnProcess,
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
                code: (err.errno === 1062) ? resCode.existOnProcess : resCode.error,
                data: null,
            })
        }
        dao.addAssessment(req.body)
            .then(responseHandler)
            .catch(errorHandler)
    },

    modifyAssessment: (req, res) => {
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
            console.log(err)
            res.json({
                result: false,
                code: (err.errno === 1062) ? resCode.existOnProcess : resCode.error,
                data: null,
            })
        }

        dao.modifyAssessment(req.body)
            .then(responseHandler)
            .catch(errorHandler)
    },

    deleteAssessment: (req, res) => {
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
            console.log(err)
            res.json({
                result: false,
                code: resCode.error,
                data: null,
            })
        }

        dao.deleteAssessment(req.body.id)
            .then(responseHandler)
            .catch(errorHandler)
    },
}