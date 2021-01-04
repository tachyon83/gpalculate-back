const dao = require('../models/Dao')

module.exports = {
    getAnnoucement: (req, res) => {

        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let dt = today.getDate();

        if (dt < 10) dt = '0' + dt;
        if (month < 10) month = '0' + month;

        const q = year + '-' + month + '-' + dt

        const resCode = req.app.get('resCode')
        const responseHandler = resultArr => {
            res.json({
                result: true,
                code: resCode.success,
                data: resultArr,
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

        dao.getAnnouncement(q)
            .then(responseHandler)
            .catch(errorHandler)

    },

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

}