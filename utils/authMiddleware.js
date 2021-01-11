const tokenKey = require('../configs/webSettings').tokenKey
const jwtVerify = (require('./jwtUtil')).jwtVerify

module.exports = (req, res, next) => {
    const token = req.headers[tokenKey]
    const resCode = req.app.get('resCode')
    if (!token) {
        return res.json({
            result: false,
            code: resCode.notAuthenticated,
            data: null,
        })
    }
    jwtVerify(token)
        .then(decoded => {
            if (!decoded) {
                return res.json({
                    result: false,
                    code: resCode.notAuthenticated,
                    data: null,
                })
            }
            req.userInfo = decoded
            console.log('authenticated in authMiddlware!')
            // console.log('decoded', decoded)
            next()
        })
        .catch(err => res.json({
            result: false,
            code: resCode.error,
            data: null,
        }))
}