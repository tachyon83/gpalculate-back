const dbSetting = require('./dbConnectionSettings')

// '%' vs 'localhost'

let sql_createUser =
    `create user if not exists ${dbSetting.user}
    identified by '${dbSetting.password}';`;
let sql_grantPrivileges =
    `grant all privileges on ${dbSetting.database}.* 
    to '${dbSetting.user}'@'%';`;
let sql_flush =
    `flush privileges;`;
let sql_alterUser =
    `alter user ${dbSetting.user} 
    identified with mysql_native_password 
    by '${dbSetting.password}';`;
let sqls1 = sql_createUser + sql_grantPrivileges + sql_flush + sql_alterUser;

let sql_createDB =
    `create database if not exists ${dbSetting.database};`;

let sql_createTable_conversion =
    `create table if not exists 
    ${dbSetting.table_conversion}(
        id int not null auto_increment, 
        A1 decimal(5,2),
        A2 decimal(5,2),
        A3 decimal(5,2),
        B1 decimal(5,2),
        B2 decimal(5,2),
        B3 decimal(5,2),
        C1 decimal(5,2),
        C2 decimal(5,2),
        C3 decimal(5,2),
        D1 decimal(5,2),
        D2 decimal(5,2),
        D3 decimal(5,2),
        F decimal(5,2),
        primary key(id)
    );`

let sql_createTable_conversion2 =
    `create table if not exists
    ${dbSetting.table_conversion2}(
        k varchar(5) not null,
        v varchar(5) not null
    );`

let sql_createTable_user =
    `create table if not exists
    ${dbSetting.table_user}(
        id int not null auto_increment,
        name varchar(20) not null,
        email varchar(60) not null,
        password varchar(150) not null,
        conversionid int not null,
        primary key(id),
        foreign key(conversionid)
        references ${dbSetting.table_conversion}(id) 
        on update cascade 
        on delete cascade
    );`

let sql_createTable_semester =
    `create table if not exists
    ${dbSetting.table_semester}(
        id int not null auto_increment,
        userid int not null,
        year int not null,
        season int not null,
        primary key(id),
        foreign key(userid)
        references ${dbSetting.table_user}(id)
        on update cascade
        on delete cascade
    );`

let sql_createTable_course =
    `create table if not exists
    ${dbSetting.table_course}(
        id int not null auto_increment,
        semesterid int not null,
        name varchar(30) not null,
        units decimal(5,2),
        grade varchar(5),
        include tinyint(1),
        primary key(id),
        foreign key(semesterid)
        references ${dbSetting.table_semester}(id)
        on update cascade
        on delete cascade
    );`

let sql_createTable_assessment =
    `create table if not exists
    ${dbSetting.table_assessment}(
        id int not null auto_increment,
        courseid int not null,
        name varchar(30) not null,
        receivedScore decimal(5,2),
        totalScore decimal(5,2),
        weight decimal(5,2),
        primary key(id),
        foreign key(courseid)
        references ${dbSetting.table_course}(id)
        on update cascade
        on delete cascade
    );`

let sql_insert_conversion_1 =
    `insert into ${dbSetting.table_conversion}(A1,A2,A3,B1,B2,B3,C1,C2,C3,D1,D2,D3,F) 
    values(4.3,4.0,3.7,3.3,3.0,2.7,2.3,2.0,1.7,1.3,1.0,0.7,0);`

let sql_insert_conversion_2 =
    `insert into ${dbSetting.table_conversion}(A1,A2,A3,B1,B2,B3,C1,C2,C3,D1,D2,D3,F) 
    values(4.0,4.0,3.7,3.3,3.0,2.7,2.3,2.0,1.7,1.3,1.0,0.7,0);`

let sqls2 = sql_createTable_conversion +
    sql_createTable_conversion2 +
    sql_createTable_user +
    sql_createTable_semester +
    sql_createTable_course +
    sql_createTable_assessment +
    sql_insert_conversion_1 +
    sql_insert_conversion_2

let sql_register =
    `insert into ${dbSetting.table_user}(name,email,password,conversionid) 
    values(?,?,?,?);`

let sql_findByEmail =
    `select * from ${dbSetting.table_user} where email=? limit 1;`

let sql_existByEmail =
    `select count(*) as cnt from ${dbSetting.table_user} where email=?;`

let sql_create =
    `insert into ${dbSetting.tablename}(poolName,poolAddress,
    poolPhone,poolTypeMask,poolOpentime,poolOption) 
    select * from (select ? as poolName,? as poolAddress,
    ? as poolPhone,? as poolTypeMask,? as poolOpentime,? 
    as poolOption) as tmp where not exists(select poolName 
    from ${dbSetting.tablename} where poolName = ?) limit 1;`
let sql_detail =
    `select * from pooltable where poolId=?;`

let sql_select_totalCount =
    `select count(*) as cnt from ${dbSetting.tablename} 
    where (poolName like ? or poolAddress like ?) 
    and (poolTypeMask&?)=poolTypeMask and 
    (poolOpentime&?)=? and (poolOption&?)=?;`
let sql_select =
    `select * from ${dbSetting.tablename} 
    where (poolName like ? or poolAddress like ?) 
    and (poolTypeMask&?)=poolTypeMask and 
    (poolOpentime&?)=? and (poolOption&?)=? 
    order by poolId limit ?,?;`

let sql_delete =
    `delete from ${dbSetting.tablename} where poolId = ?;`

let sql_update =
    `update ${dbSetting.tablename} set poolName=?,
    poolAddress=?,poolPhone=?,poolTypeMask=?,poolOpentime=?,
    poolOption=? where poolId = ?;`

let sql_adminBoard =
    `select count(*) from ${dbSetting.tablename} union all
    select count(*) from ${dbSetting.tablename} where 16&poolTypeMask=16 union all
    select count(*) from ${dbSetting.tablename} where 8&poolTypeMask=8 union all
    select count(*) from ${dbSetting.tablename} where 4&poolTypeMask=4 union all
    select count(*) from ${dbSetting.tablename} where 2&poolTypeMask=2 union all
    select count(*) from ${dbSetting.tablename} where 1&poolTypeMask=1 union all
    select count(*) from ${dbSetting.tablename} where 4&poolOption=4 union all
    select count(*) from ${dbSetting.tablename} where 2&poolOption=2 union all
    select count(*) from ${dbSetting.tablename} where 1&poolOption=1;`

module.exports = {
    initialSetup: sqls1,
    newDB: sql_createDB,
    createDummy: sqls2,
    // sql_create: sql_create,
    // sql_detail: sql_detail,
    // sql_select_totalCount: sql_select_totalCount,
    // sql_select: sql_select,
    // sql_adminBoard: sql_adminBoard,
    // sql_delete: sql_delete,
    // sql_update: sql_update,
    sql_findByEmail,
    sql_existByEmail,
    sql_register,
}