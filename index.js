const http = require('http');
const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const webSettings = require('./configs/webSettings')
const authMiddleware = require('./utils/authMiddleware')
const adminAuthMiddleware = require('./utils/adminAuthMiddleware')
const app = express();

app.use(express.json())
app.set('resCode', require('./configs/responseCode'))
app.set('jwtSettings', require('./configs/jwtSettings'))
app.set('port', process.env.PORT || 3000);

app.use(cors(webSettings.corsSettings))
// app.options('/login', cors(webSettings.corsSettings))

app.use((req, res, next) => {
    // console.log(req.headers)
    let currTime = new Date();
    let timeStamp = currTime.getHours() + ':' + currTime.getMinutes();
    console.log('Server Call : ', timeStamp)
    next()
})

app.use('/user', require('./routes/user'))
app.use('/semester', authMiddleware, require('./routes/semester'))
app.use('/course', authMiddleware, require('./routes/course'))
app.use('/assessment', authMiddleware, require('./routes/assessment'))
app.use('/conversion', require('./routes/conversion'))
app.use('/admin', adminAuthMiddleware, require('./routes/admin'))

// 404
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log('reached the end...')
    res.status(err.status || 500);

    const resCode = req.app.get('resCode')
    res.json({
        result: false,
        code: resCode.invalidPath,
        data: null,
    })
    // res.render('error');
});

// app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log('http://localhost:%d', app.get('port'));
});
