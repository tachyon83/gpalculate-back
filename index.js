const http = require('http');
const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const webSettings = require('./configs/webSettings')
const authMiddleware = require('./utils/authMiddleware')
const app = express();

app.use(express.json())
app.set('resCode', require('./configs/responseCode'))
app.set('jwtSettings', require('./configs/jwtSettings'))
app.set('port', process.env.PORT || 3000);

app.use(cors(webSettings.corsSettings))
// app.options('/login', cors(webSettings.corsSettings))

app.use((req, res, next) => {
    // console.log(req.headers)
    console.log('Server Call Time: ', Date.now())
    next()
})

app.use('/user', require('./routes/user'))
app.use('/semester', authMiddleware, require('./routes/semester'))
app.use('/course', authMiddleware, require('./routes/course'))
app.use('/assessment', authMiddleware, require('./routes/assessment'))
app.use('/admin', authMiddleware, (req, res) => {
    res.json({ response: 'wow authenticated' })
})
// app.use('/logout', (req, res) => {
//     // req.logout();
//     // req.session.save(function () {
//     //     res.redirect('/');
//     // })
//     req.session.destroy(err => {
//         if (err) res.status(500);
//         res.json({ response: true })
//     })
// })

// // 404
// app.use(function (req, res, next) {
//     // next(createError(404));
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    console.log('reached the end...404 or 500')
    // res.render('error');
});

// app.use('/', router);
const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log('http://localhost:%d', app.get('port'));
});
