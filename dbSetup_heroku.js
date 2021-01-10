const mysql = require('mysql');
const dbSetting = require('./models/settings/dbConnectionSettings')
const sqls = require('./models/settings/sqlDispenser')
const bcrypt = require('bcrypt')
const saltRounds = 10

let settingObj = {
    host: dbSetting.host,
    port: dbSetting.port,
    user: dbSetting.user,
    password: dbSetting.password,
    database: dbSetting.database,
    multipleStatements: true,
}

const sql_addSuperuser =
    `insert into user(name,email,password,conversionid,help,admin) 
    values(?,?,?,?,?,?);`

// maybe... need to make conversionId nullable?
let superuser = [
    'superuser',
    'superuser@gpa.com',
    process.env.SUPERUSER_PASSWORD,
    1, 0, 1,
]

function db_initSetting() {
    return new Promise((resolve, reject) => {
        const conn = mysql.createConnection(settingObj)
        conn.connect();
        conn.query(sqls.createDummy, err => {
            if (err) {
                conn.destroy()
                return reject(err)
            }
            bcrypt.genSalt(saltRounds)
                .then(salt => {
                    return bcrypt.hash(superuser[2], salt)
                })
                .then(hash => {
                    superuser[2] = hash
                    conn.query(sql_addSuperuser, superuser, err => {
                        conn.destroy();
                        if (err) return reject(err);
                        resolve();
                    })
                })
                .catch(err => reject(err))
        })
    })
}

async function dbSetup_heroku() {
    await db_initSetting()
    console.log('DB setup on heroku complete!')
}
dbSetup_heroku()
