const dao = require('../models/Dao')

module.exports = {
    getConversion: (req, res) => {
        const resCode = req.app.get('resCode')

        const getConversion = rows => {
            return new Promise(async (resolve, reject) => {
                if (!rows) return resolve(false)
                let result = []
                for (const row of rows) {
                    let temp = {
                        conversionId: row.id,
                    }

                    // conversionid (not conversionId),
                    // because it is coming directly from DB
                    const [number] = await dao.getNumberFromConversion(row.id)
                    delete number.id

                    const letter = await dao.getLetterFromConversion()

                    temp.conversion = [...letter].map(e => ({
                        letter: e.v,
                        number: number[e.k],
                    }))
                    result.push(temp)
                }
                resolve(result)
            })
        }

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
                    data: result,
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
        dao.getConversion()
            .then(getConversion)
            .then(responseHandler)
            .catch(errorHandler)

    },
}