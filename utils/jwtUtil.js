const jwt = require('jsonwebtoken')
const jwtSettings = require('../configs/jwtSettings')
const dao = require('../models/Dao')

module.exports = {
    jwtSign: result => {
        if (!result) return Promise.resolve(false)
        return new Promise((resolve, reject) => {
            delete result.password
            jwt.sign(
                result,
                jwtSettings.secret,
                jwtSettings.claims,
                (err, token) => {
                    if (err) {
                        console.log('err while signing', err)
                        return reject(err)
                    }
                    result.token = token
                    resolve(result)
                })
        })
    },

    jwtVerify: token => {
        if (!token) return Promise.resolve(false)
        return new Promise((resolve, reject) => {
            jwt.verify(token, jwtSettings.secret, (err, decoded) => {
                if (err) return reject(err)
                dao.findByEmail(decoded.email)
                    .then(userInfo => {
                        userInfo = userInfo[0]
                        if (!userInfo) return resolve(false)
                        resolve(decoded)
                    })
                    .catch(err => reject(err))
            })
        })
    }
}