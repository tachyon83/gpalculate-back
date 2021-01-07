const dao = require('../models/Dao')

module.exports = {

    addAnnouncement: (req, res) => {
        const resCode = req.app.get('resCode')

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
                code: (err.errno === 1062) ? resCode.existOnProcess : resCode.error,
                data: null,
            })
        }
        dao.addAnnouncement(req.body)
            .then(responseHandler)
            .catch(errorHandler)
    },

    addConversion: (req, res) => {
        const resCode = req.app.get('resCode')

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
                code: (err.errno === 1062) ? resCode.existOnProcess : resCode.error,
                data: null,
            })
        }
        dao.addConversion(req.body.conversion)
            .then(responseHandler)
            .catch(errorHandler)
    },

    getUserTotal: (req, res) => {
        const resCode = req.app.get('resCode')

        const responseHandler = result => {
            result = result[0].cnt
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
        dao.getUserTotal()
            .then(responseHandler)
            .catch(errorHandler)

    },

    getUserList: (req, res) => {
        const resCode = req.app.get('resCode')

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
        dao.getUserList()
            .then(responseHandler)
            .catch(errorHandler)

    },

    deleteUser: (req, res) => {
        const resCode = req.app.get('resCode')

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
                code: resCode.error,
                data: null,
            })
        }
        dao.deleteUser(req.body.email)
            .then(responseHandler)
            .catch(errorHandler)
    },

    findUserByKeyword: (req, res) => {
        const resCode = req.app.get('resCode')

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
        dao.findUserByKeyword(req.params.keyword)
            .then(responseHandler)
            .catch(errorHandler)
    },

}