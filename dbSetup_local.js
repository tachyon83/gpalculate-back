const mysql = require('mysql');
const dbSetting = require('./models/settings/dbConnectionSettings')
const sqls = require('./models/settings/sqlDispenser')
const bcrypt = require('bcrypt')
const saltRounds = 10

let rootSettingObj = {
    host: dbSetting.host,
    port: dbSetting.port,
    user: dbSetting.yourLocalMySQLUsername,
    password: dbSetting.yourLocalMySQLPassword,
    multipleStatements: true,
}
let settingObj = {
    host: dbSetting.host,
    port: dbSetting.port,
    user: dbSetting.user,
    password: dbSetting.password,
    multipleStatements: true,
}

const sql_addSuperuser =
    `insert into user(name,email,password,conversionid,help,admin) 
    values(?,?,?,?,?,?);`

// maybe... need to make conversionId nullable?
let superuser = [
    'superuser',
    'superuser@gpa.com',
    'abcd1234',
    1, 0, 1,
]

function db_initSetting() {
    return new Promise((resolve, reject) => {
        const conn_init1 = mysql.createConnection(rootSettingObj)
        conn_init1.connect();
        conn_init1.query(sqls.initialSetup, (err) => {
            conn_init1.destroy();
            if (err) reject(err);
            const conn_init2 = mysql.createConnection(settingObj)
            conn_init2.connect()
            conn_init2.query(sqls.newDB, (err) => {
                conn_init2.destroy();
                if (err) reject(err);
                settingObj.database = dbSetting.database
                const conn_init3 = mysql.createConnection(settingObj)
                conn_init3.connect()
                conn_init3.query(sqls.createDummy, (err) => {
                    if (err) {
                        conn_init3.destroy()
                        reject(err)
                    }
                    bcrypt.genSalt(saltRounds)
                        .then(salt => {
                            return bcrypt.hash(superuser[2], salt)
                        })
                        .then(hash => {
                            superuser[2] = hash
                            conn_init3.query(sql_addSuperuser, superuser, err => {
                                conn_init3.destroy();
                                if (err) reject(err);
                                resolve();
                            })
                        })
                        .catch(err => reject(err))
                })
            })
        })
    })
}

async function dbSetup() {
    await db_initSetting().then(
        console.log('DB setup complete!')
    ).catch(err => console.log(err))
}
dbSetup()
