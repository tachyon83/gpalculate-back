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
        if (q) sql = mysql.format(sql, q)
        console.log('q in sqlhandler', q)
        return new Promise((resolve, reject) => {
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
                    console.log('db process result', rows)
                    resolve(rows)
                })
            })
        })
    }

    register = q => {
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

    create = (q, fn) => {
        let info = [
            // this.usedIds.length ? this.usedIds.shift() : 'null',
            q.poolName,
            q.poolAddress,
            q.poolPhone,
            q.poolTypeMask,
            q.poolOpentime,
            q.poolOption,
            q.poolName,
        ]
        this.sqlHandler(sqls.sql_create, info, fn).then(res => {
            fn(null, { response: true })
        }).catch(err => {
            fn(err, null)
        })
    }

    update = (q, fn) => {
        let info = [
            q.poolName,
            q.poolAddress,
            q.poolPhone,
            q.poolTypeMask,
            q.poolOpentime,
            q.poolOption,
            q.poolId,
        ]
        this.sqlHandler(sqls.sql_update, info, fn).then(res => {
            fn(null, { response: true })
        }).catch(err => {
            fn(err, null)
        })
    }

    delete = (id, fn) => {
        this.sqlHandler(sqls.sql_delete, id, fn).then(res => {
            fn(null, { response: true })
        }).catch(err => {
            fn(err, null)
        })
    }

    showAdminBoard = fn => {
        let boardItemNames = [
            'poolCount',
            'publicCount',
            'privateCount',
            'hotelCount',
            'indoorCount',
            'outdoorCount',
            'childCount',
            'womanCount',
            'disabledCount',
        ]
        this.sqlHandler(sqls.sql_adminBoard, null, fn).then(rows => {
            let ret = {}
            for (let i in rows) ret[boardItemNames[i]] = Object.values(rows[i])[0]
            fn(null, ret)
        }).catch(err => {
            fn(err, null)
        })
    }

    findDetailById = (id, fn) => {
        this.sqlHandler(sqls.sql_detail, id, fn).then(res => {
            fn(null, res[0])
        }).catch(err => {
            fn(err, null)
        })
    }

    findList = (q, fn) => {
        let pageNumber = q.pageNumber;
        let searchWord = '%' + q.searchWord + '%';

        // poolTypeMask와 row의 AND연산 후에 row면 true
        let poolTypeArray = [
            q.poolOutdoor,
            q.poolIndoor,
            q.poolHotel,
            q.poolPrivate,
            q.poolPublic,
        ];
        let poolTypeMask = 0;
        for (let i in poolTypeArray) if (poolTypeArray[i] == paginationSettings.checked) poolTypeMask |= (1 << i);

        // opentime은 AND연산 후에 search opentime과 같으면 true
        let poolOpentime = q.poolOpentime;

        // child,woman,disabled는 AND연산으로 확인
        let poolOptionArray = [
            q.poolForDisabled,
            q.poolForWoman,
            q.poolForChild,
        ]
        let poolOption = 0
        for (let i in poolOptionArray) if (poolOptionArray[i] == paginationSettings.checked) poolOption |= (1 << i);

        let totalCountParams = [searchWord, searchWord, poolTypeMask, poolOpentime, poolOpentime, poolOption, poolOption]
        let selectParams = [searchWord, searchWord, poolTypeMask, poolOpentime, poolOpentime, poolOption, poolOption, (pageNumber - 1) * paginationSettings.itemsPerPage, paginationSettings.itemsPerPage]

        this.sqlHandler(sqls.sql_select_totalCount, totalCountParams, fn).then(cntRes => {
            this.sqlHandler(sqls.sql_select, selectParams, fn).then(rows => {
                let pools = []
                for (let row of rows) {
                    pools.push(row)
                }
                let result = {
                    'totalCount': cntRes[0].cnt,
                    'pools': pools,
                }
                fn(null, result)
            }).catch(err => {
                fn(err, null)
            })
        }).catch(err => {
            fn(err, null)
        })
    }
}

module.exports = new Dao()