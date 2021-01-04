const express = require('express');
const router = express.Router()
const dao = require('../models/Dao')

router.get('/', (req, res) => {

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

})

module.exports = router