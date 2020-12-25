const dao = require('../models/Dao')

module.exports = {
    getConversion: (req, res) => {
        const resCode = req.app.get('resCode')

        const getConversion = rows => {
            if (!rows) return Promise.resolve(false)

            const eachRowHandler = row => new Promise(async (resolve, reject) => {
                let temp = {
                    conversionId: row.id,
                }
                const [number] = await dao.getNumberFromConversion(row.id).catch(err => reject(err))
                delete number.id

                const letter = await dao.getLetterFromConversion().catch(err => reject(err))
                temp.conversion = [...letter].map(e => ({
                    letter: e.v,
                    number: number[e.k],
                }))
                resolve(temp)
            })
            return Promise.all(rows.map(eachRowHandler))
        }

        const responseHandler = result => {
            res.json({
                result: result ? true : false,
                code: result ? resCode.success : resCode.error,
                data: result ? result : null,
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
        dao.getConversion()
            .then(getConversion)
            .then(responseHandler)
            .catch(errorHandler)
    },
}