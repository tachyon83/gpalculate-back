const dao = require('../models/Dao')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = {
    help: (req, res) => {
        const resCode = req.app.get('resCode')

        const responseHandler = result => {
            if (!result.affectedRows) {
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

        dao.help(req.userInfo.id)
            .then(responseHandler)
            .catch(errorHandler)
    },

    detail: (req, res) => {
        const resCode = req.app.get('resCode')

        res.json({
            result: true,
            code: resCode.success,
            data: req.userInfo,
        })
    },

    register: (req, res) => {
        const resCode = req.app.get('resCode')

        const encode = result => {
            // console.log('result in encode', result[0].cnt)
            result = result[0].cnt
            return new Promise((resolve, reject) => {
                if (result > 0) {
                    resolve(false)
                    return
                }
                bcrypt.genSalt(saltRounds).then(salt => {
                    return bcrypt.hash(req.body.password, salt)
                }).then(hash => {
                    req.body.password = hash
                    resolve(req.body)
                }).catch(err => reject(err))
            })
        }

        const responseHandler = result => {
            if (!result) {
                res.json({
                    result: false,
                    code: resCode.existOnRegister,
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

        dao.existByEmail(req.body.email)
            .then(encode)
            .then(dao.register)
            .then(responseHandler)
            .catch(errorHandler)
    },

    login: (req, res) => {
        const { email, password } = req.body
        const resCode = req.app.get('resCode')
        const jwtSettings = req.app.get('jwtSettings')

        const pwCheck = result => {
            result = result[0]
            // below will cause error when result is null
            // console.log(result.password)
            return new Promise((resolve, reject) => {
                if (!result) {
                    resolve(false)
                    return
                }
                bcrypt.compare(password, result.password, (err, res) => {
                    if (err) {
                        console.log('err in bcrypt', err)
                        reject(err)
                    }
                    else if (res) resolve(result)
                    else resolve(false)
                })
            })
        }

        const addConversion = result => {
            return new Promise((resolve, reject) => {
                if (!result) {
                    resolve(false)
                    return
                }
                // conversionid (not conversionId),
                // because it is coming directly from DB
                dao.getNumberFromConversion(result.conversionid)
                    .then(number => {
                        number = number[0]
                        delete number.id
                        dao.getLetterFromConversion()
                            .then(letter => {
                                let conversionArr = []
                                let conversion = {}
                                for (let e of letter) {
                                    conversionArr.push({
                                        letter: e.v,
                                        number: number[e.k]
                                    })
                                    conversion[e.v] = number[e.k]
                                }
                                result.conversionArr = conversionArr
                                result.conversion = conversion
                                resolve(result)
                            }).catch(err => reject(err))
                    }).catch(err => reject(err))
            })
        }

        const sign = result => {
            return new Promise((resolve, reject) => {
                if (!result) {
                    resolve(false)
                    return
                }
                jwt.sign({
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    conversionId: result.conversionid,
                }, jwtSettings.secret, {
                    expiresIn: jwtSettings.expiresIn,
                    issuer: jwtSettings.issuer,
                    subject: jwtSettings.subject,
                }, (err, token) => {
                    if (err) {
                        console.log('err while signing', err)
                        reject(err)
                        return
                    }
                    result.token = token
                    resolve(result)
                })
            })
        }

        const responseHandler = result => {
            if (!result.token) {
                res.json({
                    result: false,
                    code: resCode.wrongEmailOrPassword,
                    data: null,
                })
            } else {
                res.json({
                    result: true,
                    code: resCode.success,
                    data: {
                        token: result.token,
                        conversionArr: result.conversionArr,
                        conversion: result.conversion,
                    }
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

        dao.findByEmail(email)
            .then(pwCheck)
            .then(addConversion)
            .then(sign)
            .then(responseHandler)
            .catch(errorHandler)
    },

    modify: (req, res) => {
        // decode id from jwt <- done in authMiddleware and saved in req.userInfo
        // update
        // re issue and sign jwt

        const resCode = req.app.get('resCode')
        const jwtSettings = req.app.get('jwtSettings')
        req.body.id = req.userInfo.id

        const refind = result => {
            if (!result) return Promise.resolve(false)
            return new Promise((resolve, reject) => {
                dao.findByEmail(req.body.email)
                    .then(user => {
                        user = user[0]
                        if (!user) return resolve(false)
                        return resolve(user)
                    }).catch(err => { return reject(err) })
            })
        }

        const addConversion = result => {
            if (!result) return Promise.resolve(false)
            return new Promise((resolve, reject) => {
                // conversionid (not conversionId),
                // because it is coming directly from DB
                dao.getNumberFromConversion(result.conversionid)
                    .then(number => {
                        number = number[0]
                        delete number.id
                        dao.getLetterFromConversion()
                            .then(letter => {
                                let conversionArr = []
                                let conversion = {}
                                for (let e of letter) {
                                    conversionArr.push({
                                        letter: e.v,
                                        number: number[e.k]
                                    })
                                    conversion[e.v] = number[e.k]
                                }
                                result.conversionArr = conversionArr
                                result.conversion = conversion
                                resolve(result)
                            }).catch(err => reject(err))
                    }).catch(err => reject(err))
            })
        }

        const sign = result => {
            if (!result) return Promise.resolve(false)
            return new Promise((resolve, reject) => {
                jwt.sign({
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    conversionId: result.conversionid,
                }, jwtSettings.secret, {
                    expiresIn: jwtSettings.expiresIn,
                    issuer: jwtSettings.issuer,
                    subject: jwtSettings.subject,
                }, (err, token) => {
                    if (err) {
                        console.log('err while signing', err)
                        return reject(err)
                    }
                    result.token = token
                    resolve(result)
                })
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
                    data: {
                        token: result.token,
                        conversionArr: result.conversionArr,
                        conversion: result.conversion,
                    },
                })
            }
        }

        const errorHandler = err => {
            // console.log('err in errHandler', err)
            // console.log(Object.keys(err))
            // console.log(err.errno)
            res.json({
                result: false,
                code: (err.errno == 1062) ? resCode.existOnRegister : resCode.error,
                data: null,
            })
        }

        dao.modifyById(req.body)
            .then(refind)
            .then(addConversion)
            .then(sign)
            .then(responseHandler)
            .catch(errorHandler)
    }
}