const jwt = require('jsonwebtoken')
const tokenKey = require('../configs/webSettings').tokenKey

module.exports = (req, res, next) => {
    const token = req.headers[tokenKey]
    if (!token) {
        return res.json({
            result: false,
            code: req.app.get('resCode').notAuthenticated,
            data: null,
        })
    }
    jwt.verify(token, req.app.get('jwtSettings').secret, (err, decoded) => {
        if (err) {
            return res.json({
                result: false,
                // code: req.app.get('resCode').error,
                code: req.app.get('resCode').notAuthenticated,
                data: null,
            })
        }
        if (!decoded.isAdmin) {
            return res.json({
                result: false,
                code: req.app.get('resCode').notAuthenticated,
                data: null,
            })
        }
        req.userInfo = decoded
        console.log('authenticated in adminAuthMiddlware!')
        // console.log('decoded', decoded)
        next()
    })
}