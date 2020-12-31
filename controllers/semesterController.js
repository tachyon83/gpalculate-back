const dao = require('../models/Dao')

module.exports = {
    saveSemester: (req, res) => {
        const resCode = req.app.get('resCode')

        const eachCourseHandler = async course => {
            if (!course) {
                let err = new Error()
                err.reason = 'noInput'
                throw err
            }
            const eachResult = await dao.updateInclude([course.include, course.id])
            if (!eachResult.affectedRows) {
                let err = new Error()
                err.reason = 'noMatch'
                throw err
            }
            return Promise.resolve(true)
        }

        const eachSemesterHandler = async semester => {
            if (!semester) {
                let err = new Error()
                err.reason = 'noInput'
                throw err
            }
            return Promise.all(semester.courses.map(eachCourseHandler))
        }

        const saveHandler = data => {
            if (!data) {
                let err = new Error()
                err.reason = 'noInput'
                throw err
            }
            return Promise.all(data.map(eachSemesterHandler))
        }

        const responseHandler = result => {
            res.json({
                result: true,
                code: resCode.success,
                data: null,
            })
        }
        const errorHandler = err => {
            console.log(err)
            res.json({
                result: false,
                code: err.reason ? resCode[err.reason] : resCode.error,
                data: null,
            })
        }

        saveHandler(req.body.data)
            .then(responseHandler)
            .catch(errorHandler)
    },

    getSemester: (req, res) => {
        const resCode = req.app.get('resCode')

        const semesterCollector = rows => {
            if (!rows) return Promise.resolve([])
            const eachRowHandler = row => new Promise(async (resolve, reject) => {
                let temp = {
                    id: row.id,
                    year: row.year,
                    season: row.season,
                    courses: await dao.getCourses(row.id).catch(err => reject(err))
                }
                resolve(temp)
            })
            return Promise.all(rows.map(eachRowHandler))
        }

        const responseHandler = result => {
            res.json({
                result: true,
                code: resCode.success,
                data: result,
            })
        }
        const errorHandler = err => {
            console.log(err)
            res.json({
                result: false,
                code: resCode.error,
                data: null,
            })
        }

        dao.findAllSemesters(req.userInfo.id)
            .then(semesterCollector)
            .then(responseHandler)
            .catch(errorHandler)
    },

    addSemester: (req, res) => {
        const resCode = req.app.get('resCode')
        req.body.userId = req.userInfo.id

        const responseHandler = result => {
            console.log(result)
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
            } else if (!result.affectedRows) {
                res.json({
                    result: false,
                    code: resCode.noMatch,
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