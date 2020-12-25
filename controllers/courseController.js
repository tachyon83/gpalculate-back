const dao = require('../models/Dao')

module.exports = {
    detailCourse: (req, res) => {
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
                    data: {
                        year: result.year,
                        season: result.season,
                        name: result.name,
                        units: result.units,
                        grade: result.grade,
                        assessment: result.assessmentsArr,
                    },
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
        dao.detailCourse(req.params.id)
            .then(result => {
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