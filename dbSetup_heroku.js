const mysql = require('mysql');
const dbSetting = require('./models/settings/dbConnectionSettings')
const sqls = require('./models/settings/sqlDispenser')

let settingObj = {
    host: dbSetting.host,
    port: dbSetting.port,
    user: dbSetting.user,
    password: dbSetting.password,
    database: dbSetting.database,
    multipleStatements: true,
}

function db_initSetting() {
    return new Promise((resolve, reject) => {
        const conn = mysql.createConnection(settingObj)
        conn.connect();
        conn.query(sqls.createDummy, err => {
            conn.destroy();
            if (err) throw err;
            resolve()
        })
    })
}

async function dbSetup_heroku() {
    await db_initSetting()
    console.log('DB setup on heroku complete!')
}
dbSetup_heroku()
