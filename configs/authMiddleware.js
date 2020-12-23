const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token']
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
        req.userInfo = decoded
        console.log('decode', decoded)
        next()
    })
}