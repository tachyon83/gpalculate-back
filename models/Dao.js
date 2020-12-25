const mysql = require('mysql');
const dbCreate = require('./dbPoolCreator')
const sqls = require('./settings/sqlDispenser')

class Dao {
    constructor() {
        dbCreate().then(pool => {
            this.dbpool = pool
            console.log('Dao class instance and its dbPool created...')
        })
        // this.usedIds=[]
    }

    // arrow function is needed to have an access to this.dbpool
    // because in class, written in 'strict mode'

    sqlHandler = (sql, q) => {
        return new Promise((resolve, reject) => {
            if (q === false) return resolve(false)
            if (q) sql = mysql.format(sql, q)
            this.dbpool.getConnection((err, conn) => {
                if (err) {
                    console.log('err in getconn', err)
                    if (conn) conn.release();
                    reject(err)
                    return;
                }
                conn.query(sql, (err, rows, fields) => {
                    conn.release();
                    if (err) {
                        console.log('err in query', err)
                        reject(err)
                        return;
                    }
                    // console.log('db process result', rows)
                    resolve(rows)
                })
            })
        })
    }

    register = q => {
        if (!q) return new Promise((resolve, reject) => {
            resolve(false)
        })
        let info = [
            q.name,
            q.email,
            q.password,
            q.conversionId,
        ]
        return this.sqlHandler(sqls.sql_register, info)
    }
    findByEmail = email => {
        return this.sqlHandler(sqls.sql_findByEmail, email)
    }
    existByEmail = email => {
        return this.sqlHandler(sqls.sql_existByEmail, email)
    }

    getNumberFromConversion = converionId => {
        return this.sqlHandler(sqls.sql_getNumberFromConversion, converionId)
    }
    getLetterFromConversion = () => {
        return this.sqlHandler(sqls.sql_getLetterFromConversion)
    }

    modifyById = q => {
        let info = [
            q.name,
            q.email,
            q.conversionId,
            q.id,
        ]
        return this.sqlHandler(sqls.sql_modifyById, info)
    }

    addSemester = q => {
        let info = [
            q.userId,
            q.year,
            q.season,
        ]
        info = concat(info)
        return this.sqlHandler(sqls.sql_addSemester, info)
    }
    deleteSemester = id => {
        return this.sqlHandler(sqls.sql_deleteSemester, id)
    }

    addCourse = q => {
        let info = [
            q.semesterId,
            q.name,
            q.units,
            q.grade,
            q.include,
        ]
        info = info.concat(info)
        return this.sqlHandler(sqls.sql_addCourse, info)
    }
    modifyCourse = q => {
        let info = [
            q.semesterId,
            q.name,
            q.units,
            q.grade,
            q.include,
            q.id,
        ]
        return this.sqlHandler(sqls.sql_modifyCourse, info)
    }
    deleteCourse = id => {
        return this.sqlHandler(sqls.sql_deleteCourse, id)
    }

    addAssessment = q => {
        let info = [
            q.courseId,
            q.name,
            q.receivedScore,
            q.totalScore,
            q.weight,
        ]
        info = info.concat(info)
        return this.sqlHandler(sqls.sql_addAssessment, info)
    }
    modifyAssessment = q => {
        let info = [
            q.courseId,
            q.name,
            q.receivedScore,
            q.totalScore,
            q.weight,
            q.id,
        ]
        return this.sqlHandler(sqls.sql_modifyAssessment, info)
    }
    deleteAssessment = id => {
        return this.sqlHandler(sqls.sql_deleteAssessment, id)
    }

    detailCourse = id => {
        return this.sqlHandler(sqls.sql_detailCourse, id)
    }
    assessmentsByCourse = id => {
        return this.sqlHandler(sqls.sql_assessmentsByCourse, id)
    }
    getConversion = () => {
        return this.sqlHandler(sqls.sql_getConversion)
    }

}

module.exports = new Dao()