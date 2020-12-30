const dao = require('../models/Dao')

module.exports = {
    detailCourse: (req, res) => {
        const resCode = req.app.get('resCode')

        const userCheck = result => {
            result = result[0]
            if (!result) return Promise.resolve(false)
            return Promise.resolve((req.userInfo.id === result.userid) ? req.params.id : false)
        }
        const responseHandler = result => {
            if (!result) {
                res.json({
                    result: false,
                    code: resCode.notAuthenticated,
                    data: null,
                })
            } else {
                res.json({
                    result: true,
                    code: resCode.success,
                    data: result,
                })
            }
        }
        const errorHandler = err => {
            err.reason === ''
            console.log(err)
            res.json({
                result: false,
                code: resCode.error,
                data: null,
            })
        }

        dao.checkUserIdFromCourse(req.params.id)
            .then(userCheck)
            .then(dao.detailCourse)
            .then(result => {
                if (!result) return Promise.resolve(false)
                result = result[0]
                return new Promise((resolve, reject) => {
                    dao.assessmentsByCourse(req.params.id)
                        .then(assessments => {
                            result.assessmentsArr = assessments
                            resolve(result)
                        }).catch(err => reject(err))
                })
            })
            .then(responseHandler)
            .catch(errorHandler)

    },
    addCourse: (req, res) => {
        const resCode = req.app.get('resCode')

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
        dao.addCourse(req.body)
            .then(responseHandler)
            .catch(errorHandler)
    },

    modifyCourse: (req, res) => {
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

        dao.modifyCourse(req.body)
            .then(responseHandler)
            .catch(errorHandler)
    },

    deleteCourse: (req, res) => {
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

        dao.deleteCourse(req.body.id)
            .then(responseHandler)
            .catch(errorHandler)
    },
}