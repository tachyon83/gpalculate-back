const dao = require('../models/Dao')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = {
    register: (req, res) => {
        const resCode = req.app.get('resCode')

        const encode = result => {
            console.log('result in encode', result[0].cnt)
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
            console.log(password)
            console.log(result.password)
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
                    resolve(token)
                })
            })
        }

        const responseHandler = token => {
            if (!token) {
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
                        token,
                    }
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

        dao.findByEmail(email)
            .then(pwCheck)
            .then(sign)
            .then(responseHandler)
            .catch(errorHandler)
    }
}